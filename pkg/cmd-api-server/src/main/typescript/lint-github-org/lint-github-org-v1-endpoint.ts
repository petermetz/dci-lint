import { Express, Request, Response, NextFunction } from "express";
import safeStringify from "fast-safe-stringify";

import {
  IWebServiceEndpoint,
  IExpressRequestHandler,
} from "@dci-lint/core-api";

import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@dci-lint/common";

import { registerWebServiceEndpoint } from "@dci-lint/core";

import { LintGithubOrgV1Endpoint as Constants } from "@dci-lint/core-api";

export interface ILintGithubOrgV1EndpointOptions {
  logLevel?: LogLevelDesc;
}

export class LintGithubOrgV1Endpoint {
  public static readonly CLASS_NAME = "LintGithubOrgV1Endpoint";

  private readonly log: Logger;

  public get className() {
    return LintGithubOrgV1Endpoint.CLASS_NAME;
  }

  constructor(public readonly options: ILintGithubOrgV1EndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public getPath(): string {
    return Constants.HTTP_PATH;
  }

  public getVerbLowerCase(): string {
    return Constants.HTTP_VERB_LOWER_CASE;
  }

  public registerExpress(app: Express): IWebServiceEndpoint {
    registerWebServiceEndpoint(app, this);
    return this;
  }

  async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      this.log.debug(`GET ${this.getPath()}`);
      // const body: LintGithubOrgResponse = { };
      const body: any = {};
      res.status(200);
      res.json(body);
    } catch (ex: unknown) {
      const innerEx = ex instanceof Error ? ex.stack : safeStringify(ex);
      res.status(500);
      res.json({ error: innerEx });
    }
  }
}
