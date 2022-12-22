import { AddressInfo } from "net";
import http from "http";

import test, { Test } from "tape-promise/tape";

import { Configuration, DefaultApi as DciLintApi } from "@dci-lint/core-api";
import { Configuration as ApiServerApiConfiguration } from "@dci-lint/cmd-api-server";
import { DefaultApi as ApiServerApi } from "@dci-lint/cmd-api-server";
import { ApiServer, ConfigService } from "@dci-lint/cmd-api-server";
import { IListenOptions, LogLevelDesc, Servers } from "@dci-lint/common";

const RE_ISO_8601_DATE_TIME_STRING: RegExp =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

const logLevel: LogLevelDesc = "TRACE";

test("Lint a git repo", async (t: Test) => {
  const server = http.createServer();
  const listenOptions: IListenOptions = {
    hostname: "127.0.0.1",
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

  const { port } = addressInfo;
  const apiHost = `http://127.0.0.1:${port}`;
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

test("Respond to Health-check Requests", async (t: Test) => {
  const server = http.createServer();
  const listenOptions: IListenOptions = {
    hostname: "127.0.0.1",
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

  const { port } = addressInfo;
  const apiHost = `http://127.0.0.1:${port}`;
  const configuration = new ApiServerApiConfiguration({ basePath: apiHost });
  const apiClient = new ApiServerApi(configuration);

  const cloneUrl = "https://github.com/petermetz/random-english-words.git";

  const res1 = await apiClient.healthCheckV1();

  t.ok(res1, "Response truthy OK");
  t.equal(res1.status, 200, "Response status equals 200 OK");
  t.match(
    res1.data.createdAt,
    RE_ISO_8601_DATE_TIME_STRING,
    "res1.data.createdAt matches ISO DateTime regular expression."
  );
});
