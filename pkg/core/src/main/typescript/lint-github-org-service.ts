import { Logger, Checks, LogLevelDesc, LoggerProvider } from "@dci-lint/common";

export interface ILintGithubOrgServiceOptions {
  logLevel?: LogLevelDesc;
}

export class LintGithubOrgService {

  public static readonly CLASS_NAME = "LintGithubOrgService";

  private readonly log: Logger;

  public get className() {
    return LintGithubOrgService.CLASS_NAME;
  }

  constructor(public readonly options: ILintGithubOrgServiceOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label});
  }

  public async run(req: any): Promise<any> {
    this.log.info("Linting Github Organization...");

    this.log.info("Linting Github Organization OK");
    return {};
  }
}
