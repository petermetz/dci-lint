import { AddressInfo } from "net";
import http from "http";

import test, { Test } from "tape-promise/tape";

import { DefaultApi as DciLintApi } from "@dci-lint/core-api";
import { ApiServer, ConfigService } from "@dci-lint/cmd-api-server";
import { IListenOptions, LogLevelDesc, Servers } from "@dci-lint/common";

const logLevel: LogLevelDesc = "TRACE";

test("Lint a git repo", async (t: Test) => {
  const server = http.createServer();
  const listenOptions: IListenOptions = {
    hostname: "localhost",
    port: 0,
    server,
  };
  const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;

  const configService = new ConfigService();
  const apiServerOptions = configService.newExampleConfig();
  apiServerOptions.configFile = "";
  apiServerOptions.apiCorsDomainCsv = "*";
  apiServerOptions.apiPort = addressInfo.port;
  apiServerOptions.apiTlsEnabled = false;
  apiServerOptions.cockpitTlsEnabled = false;
  apiServerOptions.cockpitPort = 0;
  apiServerOptions.logLevel = logLevel;
  apiServerOptions.cockpitWwwRoot = "./node_modules/@dci-lint/cockpit/www/";
  const config = configService.newExampleConfigConvict(apiServerOptions);
  const apiServer = new ApiServer({
    httpServerApi: server,
    config: config.getProperties(),
  });

  await apiServer.start();
  test.onFinish(async () => await apiServer.shutdown());

  const { address, port } = addressInfo;
  const apiHost = `http://${address}:${port}`;
  const apiClient = new DciLintApi({ basePath: apiHost });

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
