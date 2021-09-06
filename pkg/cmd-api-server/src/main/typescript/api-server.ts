import path from "path";
import { gte } from "semver";
import { AddressInfo } from "net";
import tls from "tls";
import { Server, createServer } from "http";
import { Server as SecureServer } from "https";
import { createServer as createSecureServer } from "https";
import expressHttpProxy from "express-http-proxy";
import express, {
  Express,
  Request,
  Response,
  RequestHandler,
  Application,
} from "express";
import * as OpenApiValidator from "express-openapi-validator";
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";

import { Logger, LoggerProvider, Servers } from "@dci-lint/common";
import { LintGitRepoService } from "@dci-lint/core";
import { OPEN_API_JSON as OAS_CORE_API } from "@dci-lint/core-api";

import { OPEN_API_JSON as OAS_API_SERVER } from "./openapi-spec";
import { IApiServerOptions } from "./config/config-service";
import { LintGitRepoV1Endpoint } from "./lint-git-repo/lint-git-repo-v1-endpoint";
import { OpenApiRequestHandler } from "express-openapi-validator/dist/framework/types";

export interface IApiServerConstructorOptions {
  httpServerApi?: Server | SecureServer;
  httpServerCockpit?: Server | SecureServer;
  config: IApiServerOptions;
}

export class ApiServer {
  private readonly log: Logger;
  private readonly httpServerApi: Server | SecureServer;
  private readonly httpServerCockpit: Server | SecureServer;

  constructor(public readonly options: IApiServerConstructorOptions) {
    if (!options) {
      throw new Error(`ApiServer#ctor options was falsy`);
    }
    if (!options.config) {
      throw new Error(`ApiServer#ctor options.config was falsy`);
    }

    LoggerProvider.setLogLevel(options.config.logLevel);

    if (this.options.httpServerApi) {
      this.httpServerApi = this.options.httpServerApi;
    } else if (this.options.config.apiTlsEnabled) {
      this.httpServerApi = createSecureServer({
        key: this.options.config.apiTlsKeyPem,
        cert: this.options.config.apiTlsCertPem,
      });
    } else {
      this.httpServerApi = createServer();
    }

    if (this.options.httpServerCockpit) {
      this.httpServerCockpit = this.options.httpServerCockpit;
    } else if (this.options.config.cockpitTlsEnabled) {
      this.httpServerCockpit = createSecureServer({
        key: this.options.config.cockpitTlsKeyPem,
        cert: this.options.config.cockpitTlsCertPem,
      });
    } else {
      this.httpServerCockpit = createServer();
    }

    this.log = LoggerProvider.getOrCreate({
      label: "api-server",
      level: options.config.logLevel,
    });
  }

  async start(): Promise<any> {
    this.checkNodeVersion();
    const tlsMaxVersion = this.options.config.tlsDefaultMaxVersion;
    this.log.info("Setting tls.DEFAULT_MAX_VERSION to %s...", tlsMaxVersion);
    tls.DEFAULT_MAX_VERSION = tlsMaxVersion;

    try {
      const { cockpitTlsEnabled, apiTlsEnabled } = this.options.config;
      const addressInfoCockpit = await this.startCockpitFileServer();
      const addressInfoApi = await this.startApiServer();

      {
        const { apiHost: host } = this.options.config;
        const { port } = addressInfoApi;
        const protocol = apiTlsEnabled ? "https:" : "http:";
        const httpUrl = `${protocol}//${host}:${port}`;
        this.log.info(`DCI Lint API reachable ${httpUrl}`);
      }

      {
        const { cockpitHost: host } = this.options.config;
        const { port } = addressInfoCockpit;
        const protocol = cockpitTlsEnabled ? "https:" : "http:";
        const httpUrl = `${protocol}//${host}:${port}`;
        this.log.info(`Cockpit reachable ${httpUrl}`);
      }

      return { addressInfoCockpit, addressInfoApi };
    } catch (ex) {
      const errorMessage = `Failed to start ApiServer: ${ex.stack}`;
      this.log.error(errorMessage);
      this.log.error(`Attempting shutdown...`);
      await this.shutdown();
      this.log.info(`Server shut down OK`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Verifies that the currently running NodeJS process is at least of a certain
   * NodeJS version as specified by the configuration.
   *
   * @throws {Error} if the version contraint is not satisfied by the runtime.
   */
  public checkNodeVersion(currentVersion: string = process.version): void {
    if (gte(this.options.config.minNodeVersion, currentVersion)) {
      const msg =
        `ApiServer#checkNodeVersion() detected NodeJS ` +
        `v${process.version} that is outdated as per the configuration. ` +
        `If you must run on this NodeJS version you can override the minimum ` +
        `acceptable version via config parameters of the API server. ` +
        `Though doing so may lead to vulnerabilities in your deployment. ` +
        `You've been warned.`;
      throw new Error(msg);
    }
  }

  public getHttpServerApi(): Server | SecureServer {
    return this.httpServerApi;
  }

  public getHttpServerCockpit(): Server | SecureServer {
    return this.httpServerCockpit;
  }

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down API server ...`);

    if (this.httpServerApi) {
      this.log.info(`Closing HTTP server of the API...`);
      await Servers.shutdown(this.httpServerApi);
      this.log.info(`Close HTTP server of the API OK`);
    }

    if (this.httpServerCockpit) {
      this.log.info(`Closing HTTP server of the cockpit ...`);
      await Servers.shutdown(this.httpServerCockpit);
      this.log.info(`Close HTTP server of the cockpit OK`);
    }
  }

  async startCockpitFileServer(): Promise<AddressInfo> {
    const cockpitWwwRoot = this.options.config.cockpitWwwRoot;
    this.log.info(`wwwRoot: ${cockpitWwwRoot}`);

    const resolvedWwwRoot = path.resolve(process.cwd(), cockpitWwwRoot);
    this.log.info(`resolvedWwwRoot: ${resolvedWwwRoot}`);

    const resolvedIndexHtml = path.resolve(resolvedWwwRoot + "/index.html");
    this.log.info(`resolvedIndexHtml: ${resolvedIndexHtml}`);

    const cockpitCorsDomainCsv = this.options.config.cockpitCorsDomainCsv;
    const allowedDomains = cockpitCorsDomainCsv.split(",");
    const corsMiddleware = this.createCorsMiddleware(allowedDomains);

    const {
      apiHost,
      apiPort,
      cockpitApiProxyRejectUnauthorized: rejectUnauthorized,
    } = this.options.config;
    const protocol = this.options.config.apiTlsEnabled ? "https:" : "http:";
    const apiHttpUrl = `${protocol}//${apiHost}:${apiPort}`;

    const apiProxyMiddleware = expressHttpProxy(apiHttpUrl, {
      // preserve the path whatever it was. Without this the proxy just uses /
      proxyReqPathResolver: (srcReq) => srcReq.originalUrl,

      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        const { originalUrl: thePath } = srcReq;
        const srcHost = srcReq.header("host");
        const { host: destHostname, port: destPort } = proxyReqOpts;
        const destHost = `${destHostname}:${destPort}`;
        this.log.debug(`PROXY ${srcHost} => ${destHost} :: ${thePath}`);

        // make sure self signed certs are accepted if it was configured as such by the user
        (proxyReqOpts as any).rejectUnauthorized = rejectUnauthorized;
        return proxyReqOpts;
      },
    });

    const app: Express = express();
    app.use("/api/v*", apiProxyMiddleware);
    app.use(compression());
    app.use(corsMiddleware);
    app.use(express.static(resolvedWwwRoot));
    app.get("/*", (_, res) => res.sendFile(resolvedIndexHtml));

    const cockpitPort: number = this.options.config.cockpitPort;
    const cockpitHost: string = this.options.config.cockpitHost;

    if (!this.httpServerCockpit.listening) {
      await new Promise((resolve, reject) => {
        this.httpServerCockpit.once("error", reject);
        this.httpServerCockpit.once("listening", resolve);
        this.httpServerCockpit.listen(cockpitPort, cockpitHost);
      });
    }
    this.httpServerCockpit.on("request", app);

    // the address() method returns a string for unix domain sockets and null
    // if the server is not listening but we don't car about any of those cases
    // so the casting here should be safe. Famous last words... I know.
    const addressInfo = this.httpServerCockpit.address() as AddressInfo;
    this.log.info(`Cockpit net.AddressInfo`, addressInfo);

    return addressInfo;
  }

  async startApiServer(): Promise<AddressInfo> {
    const app: Application = express();
    app.use(compression());

    const apiCorsDomainCsv = this.options.config.apiCorsDomainCsv;
    const allowedDomains = apiCorsDomainCsv.split(",");
    const corsMiddleware = this.createCorsMiddleware(allowedDomains);
    app.use(corsMiddleware);

    app.use(bodyParser.json({ limit: "50mb" }));

    const openApiValidatorMiddleware = this.createOpenApiValidator();
    app.use(openApiValidatorMiddleware);

    const healthcheckHandler = (req: Request, res: Response) => {
      res.json({
        success: true,
        createdAt: new Date(),
        memoryUsage: process.memoryUsage(),
      });
    };
    app.get("/api/v1/api-server/healthcheck", healthcheckHandler);

    this.log.info(`Starting to install web services...`);

    {
      const ep = new LintGitRepoV1Endpoint({
        logLevel: this.options.config.logLevel,
        svc: new LintGitRepoService({
          logLevel: this.options.config.logLevel,
        }),
      });
      ep.registerExpress(app as any);
    }

    const apiPort: number = this.options.config.apiPort;
    const apiHost: string = this.options.config.apiHost;

    if (!this.httpServerApi.listening) {
      await new Promise((resolve, reject) => {
        this.httpServerApi.once("error", reject);
        this.httpServerApi.once("listening", resolve);
        this.httpServerApi.listen(apiPort, apiHost);
      });
    }
    this.httpServerApi.on("request", app);

    // the address() method returns a string for unix domain sockets and null
    // if the server is not listening but we don't car about any of those cases
    // so the casting here should be safe. Famous last words... I know.
    const addressInfo = this.httpServerApi.address() as AddressInfo;
    this.log.info(`DCI Lint API net.AddressInfo`, addressInfo);

    return addressInfo;
  }

  public async getLocalApiBasePath(): Promise<string> {
    const httpServer = this.getHttpServerApi();
    const addressInfo = httpServer.address() as AddressInfo;
    const { port } = addressInfo;

    const protocol = this.options.config.apiTlsEnabled ? "https" : "http";
    return `${protocol}://127.0.0.1:${port}`;
  }

  createOpenApiValidator(): OpenApiRequestHandler[] {
    return OpenApiValidator.middleware({
      apiSpec: {
        ...OAS_API_SERVER,
        ...OAS_CORE_API,
      } as any,
      validateRequests: true,
      validateResponses: false,
    });
  }

  createCorsMiddleware(allowedDomains: string[]): RequestHandler {
    const allDomainsOk = allowedDomains.includes("*");

    const corsOptionsDelegate = (req: Request, callback: any) => {
      const origin = req.header("Origin");
      const isDomainOk = origin && allowedDomains.includes(origin);
      // this.log.debug("CORS %j %j %s", allDomainsOk, isDomainOk, req.originalUrl);

      let corsOptions;
      if (allDomainsOk) {
        corsOptions = { origin: "*" }; // reflect (enable) the all origins in the CORS response
      } else if (isDomainOk) {
        corsOptions = { origin }; // reflect (enable) the requested origin in the CORS response
      } else {
        corsOptions = { origin: false }; // disable CORS for this request
      }
      callback(null, corsOptions); // callback expects two parameters: error and options
    };
    return cors(corsOptionsDelegate);
  }
}
