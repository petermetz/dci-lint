import { v4 as uuidv4 } from "uuid";
import { Express, Request, Response, NextFunction } from "express";

import {
  IWebServiceEndpoint,
  IExpressRequestHandler,
  LintGitRepoV1Endpoint as Constants,
} from "@dci-lint/core-api";

import { LintGitRepoService, registerWebServiceEndpoint } from "@dci-lint/core";

import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@dci-lint/common";

export interface ILintGitRepoV1EndpointOptions {
  logLevel?: LogLevelDesc;
  svc: LintGitRepoService;
}

export class LintGitRepoV1Endpoint {

  public static readonly CLASS_NAME = "LintGitRepoV1Endpoint";

  private readonly log: Logger;

  public get className() {
    return LintGitRepoV1Endpoint.CLASS_NAME;
  }

  constructor(public readonly options: ILintGitRepoV1EndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label});
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  getPath(): string {
    return Constants.HTTP_PATH;
  }

  getVerbLowerCase(): string {
    return Constants.HTTP_VERB_LOWER_CASE;
  }

  registerExpress(app: Express): IWebServiceEndpoint {
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
      // const body: LintGithubOrgResponse = this.options.svc.run(req.body);
      const body: any = { };
      res.status(200);
      res.json(body);
    } catch (ex) {
      res.status(500);
      res.json({ error: ex.stack });
    }
  }
}
