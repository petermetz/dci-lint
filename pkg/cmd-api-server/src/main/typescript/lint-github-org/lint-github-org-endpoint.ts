import { v4 as uuidv4 } from "uuid";
import { Express, Request, Response, NextFunction } from "express";

import {
  IWebServiceEndpoint,
  IExpressRequestHandler,
} from "@dci-lint/core-api";

// import { LintGithubOrgRequest, LintGithubOrgResponse } from "@dci-lint/core-api";

import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@dci-lint/common";


import { registerWebServiceEndpoint, } from "@dci-lint/core";

import { LintGithubOrgV1Endpoint as Constants, } from "@dci-lint/core-api";

export interface ILintGithubOrgOptions {
  logLevel?: LogLevelDesc;
}

export class LintGithubOrg implements IWebServiceEndpoint {

  public static readonly CLASS_NAME = "LintGithubOrg";

  private readonly log: Logger;

  public get className() {
    return LintGithubOrg.CLASS_NAME;
  }

  constructor(public readonly options: ILintGithubOrgOptions) {
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
      // const body: LintGithubOrgResponse = { };
      const body: any = { };
      res.status(200);
      res.json(body);
    } catch (ex) {
      res.status(500);
      res.json({ error: ex.stack });
    }
  }
}
