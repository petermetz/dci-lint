#!/usr/bin/env node

import { ApiServer } from "../api-server";
import { ConfigService } from "../config/config-service";
import { Logger, LoggerProvider } from "@dci-lint/common";
import { Optional } from "typescript-optional";

const log: Logger = LoggerProvider.getOrCreate({
  label: "api",
  level: "WARN",
});

const main = async (cfgMixin: any = {}): Promise<Optional<ApiServer>> => {
  const configService = new ConfigService();
  const config = configService.getOrCreate();
  const serverOptions = { ...config.getProperties(), ...cfgMixin };

  LoggerProvider.setLogLevel(serverOptions.logLevel);

  if (process.argv.length > 2 && process.argv[2].includes("help")) {
    const helpText = ConfigService.getHelpText();
    // tslint:disable-next-line: no-console
    console.log(helpText);
    log.info(`Effective Configuration:`);
    log.info(JSON.stringify(serverOptions, null, 4));
    return Optional.empty();
  } else {
    const apiServer = new ApiServer({ config: serverOptions });
    await apiServer.start();
    return Optional.of(apiServer);
  }
};

export async function launchApiServerApp(
  cfgMixin?: any
): Promise<Optional<ApiServer>> {
  try {
    const apiServerOrEmpty = await main(cfgMixin);
    log.info(`DCI Lint API server launched OK `);
    return apiServerOrEmpty;
  } catch (ex) {
    log.error(`DCI Lint API server crashed: `, ex);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw ex;
    }
  }
}

if (require.main === module) {
  launchApiServerApp();
}
