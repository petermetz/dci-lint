#!/usr/bin/env node

import { Argv } from "yargs";

import { Logger, LoggerProvider } from "@dci-lint/common";
import {
  Configuration,
  DefaultApi as CoreApi,
  LintGitRepoRequest,
  LintGitRepoResponse,
} from "@dci-lint/core-api";

import { launchApiServerApp } from "./dci-lint-server";
import { RuntimeError } from "run-time-error";
import { LintGitRepoService } from "@dci-lint/core";

const log: Logger = LoggerProvider.getOrCreate({
  label: "api",
  level: "TRACE",
});

const main = async (req: LintGitRepoRequest): Promise<LintGitRepoResponse> => {
  const apiServer = await launchApiServerApp({ logLevel: "ERROR" });
  if (apiServer.isEmpty()) {
    throw new Error(`DCI Lint API server failed to start for unknown reason.`);
  }
  const basePath = await apiServer.get().getLocalApiBasePath();
  const configuration = new Configuration({ basePath });
  const apiClient = new CoreApi(configuration);

  const res = await apiClient.lintGitRepoV1(req);
  const { data, status, statusText } = res;
  log.info(`DCI Lint API Response Status: ${status} - ${statusText}`);
  log.info(`DCI Lint API Response Data`, data);
  return data;
};

export async function launchCliApp(): Promise<void> {
  try {
    // tslint:disable-next-line: no-unused-expression
    require("yargs").command(
      "lint-git-repo",
      "Lints a git repository.",
      (yargs: Argv) => {
        yargs
          .option("log-level", {
            describe:
              "The log level to set for the underlying service instance.",
            requiresArg: false,
            type: "string",
          })
          .option("request", {
            describe:
              "The JSON string representing the request object as defined in the OpenAPI specifications of the LintGitRepo endpoint.",
            requiresArg: true,
            type: "string",
          })
          .option("pretty", {
            alias: "P",
            default: true,
            type: "boolean",
          })
          .env("DCI_LINT");
      },
      async (args: any) => {
        log.info(`Parsing request JSON: ${args.request}`);
        let req: LintGitRepoRequest;
        try {
          req = JSON.parse(args.request) as LintGitRepoRequest;
        } catch (ex) {
          throw new RuntimeError(
            `Failed to parse JSON request from CLI: ${args.request}`,
            ex
          );
        }
        const svc = new LintGitRepoService({
          logLevel: args.logLevel || "ERROR",
        });
        const res = await svc.run(req);
        if (args.pretty) {
          // tslint:disable-next-line: no-console
          console.log(JSON.stringify(res, null, 4));
        } else {
          // tslint:disable-next-line: no-console
          console.log(JSON.stringify(res));
        }
        if (res.linterErrors.length > 0) {
          process.exit(2);
        } else {
          process.exit(0);
        }
      }
    ).argv;
  } catch (ex) {
    log.error(`DCI Lint CLI crashed: `, ex);
    process.exit(1);
  }
}

if (require.main === module) {
  launchCliApp();
}
