import { AddressInfo } from "net";
import http from "http";

import test, { Test } from "tape-promise/tape";
import express from "express";
import bodyParser from "body-parser";

import { Configuration, DefaultApi as DciLintApi } from "@dci-lint/core-api";
import { LintGitRepoV1Endpoint } from "@dci-lint/cmd-api-server";
import {
  IListenOptions,
  LoggerProvider,
  LogLevelDesc,
  Servers,
} from "@dci-lint/common";
import { LintGitRepoService, registerWebServiceEndpoint } from "@dci-lint/core";

const logLevel: LogLevelDesc = "TRACE";

test.skip("Lint a git repo", async (t: Test) => {
  const webApp = express();
  webApp.use(bodyParser.json({ limit: "25mb" }));
  const server = http.createServer(webApp);
  const listenOptions: IListenOptions = {
    hostname: "127.0.0.1",
    port: 0,
    server,
  };
  const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
  test.onFinish(async () => await Servers.shutdown(server));

  const endpoint = new LintGitRepoV1Endpoint({
    logLevel,
    svc: new LintGitRepoService({ logLevel }),
  });
  registerWebServiceEndpoint(webApp, endpoint);

  const { address, port } = addressInfo;
  const apiHost = `http://${address}:${port}`;
  const configuration = new Configuration({ basePath: apiHost });
  const apiClient = new DciLintApi(configuration);

  const cloneUrl = "https://github.com/petermetz/random-english-words.git";

  const res1 = await apiClient.lintGitRepoV1({
    cloneUrl,
    targetPhrasePatterns: ["a65c92c0-f0a2-4d2b-9cb9-783a29318b39"],
  });

  t.ok(res1, "Response truthy OK");
  t.equal(res1.status, 200, "Response status equals 200 OK");
  t.equal(res1.data.linterErrors.length, 0, "No linter errors for UUID OK");

  const res2 = await apiClient.lintGitRepoV1({
    cloneUrl,
    targetPhrasePatterns: [
      // these phrases are present in the repo README
      "clanking",
      "pointy",
      "selected",
      "sudden",
      "walrus",
      "campfire",
    ],
  });

  t.ok(res2, "Response truthy OK");
  t.equal(res2.status, 200, "Response status equals 200 OK");
  t.notEqual(res2.data.linterErrors.length, 0, "Linter errors found OK");
});

test("respects the .dcilintignore configuration", async (t: Test) => {
  const LOG = LoggerProvider.getOrCreate({
    level: "DEBUG",
    label: "lint-git-repo-v1-endpoint.test",
  });

  const webApp = express();
  webApp.use(bodyParser.json({ limit: "25mb" }));
  const server = http.createServer(webApp);
  const listenOptions: IListenOptions = {
    hostname: "127.0.0.1",
    port: 0,
    server,
  };
  const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
  LOG.debug("AddressInfo: %o", addressInfo);

  test.onFinish(async () => await Servers.shutdown(server));

  const endpoint = new LintGitRepoV1Endpoint({
    logLevel,
    svc: new LintGitRepoService({ logLevel }),
  });
  registerWebServiceEndpoint(webApp, endpoint);

  const { port } = addressInfo;
  // started hardcoding this as 127.0.0.1 since NodeJS v18 defaults to IPv6
  // which is broken on GitHub CI action workflows for some reason...
  // meaning that the address comes back as "::1" (which equals 127.0.0.1)
  // but then the API server rejects it with a 404
  const apiHost = `http://127.0.0.1:${port}`;
  LOG.debug("API Host: %o", apiHost);

  const configuration = new Configuration({ basePath: apiHost });
  const apiClient = new DciLintApi(configuration);

  const cloneUrl = "https://github.com/petermetz/random-english-words.git";

  const res1 = await apiClient.lintGitRepoV1({
    cloneUrl,
    // These are phrases that are present in the license file, meaning that
    // unless our test is successful these should be marked as errors.
    // The ignore file of our target repo however does specify the license
    // file to be ignored so we'll assert that there were no errors for a pass.
    targetPhrasePatterns: ["NONINFRINGEMENT", "MERCHANTABILITY"],
  });

  t.ok(res1, "Response truthy OK");
  t.equal(res1.status, 200, "Response status equals 200 OK");
  t.equal(res1.data.linterErrors.length, 0, "No linter errors found OK");
});
