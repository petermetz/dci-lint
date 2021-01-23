import { Component, Inject, OnInit } from "@angular/core";

import { Logger, LoggerProvider, ILoggerOptions } from "@dci-lint/common";

import {
  DefaultApi as DciLintApi,
  Configuration,
  LintGitRepoResponse,
} from "@dci-lint/core-api";

import { API_URL } from "src/constants";

@Component({
  selector: "app-lint-git-repo",
  templateUrl: "./lint-git-repo.page.html",
  styleUrls: [],
})
export class LintGitRepoPage implements OnInit {
  private readonly log: Logger;

  public apiHost: string;
  public gitCloneUrl: string;
  public targetPhrasePatterns: string[];
  public targetPhrasePatternsCsv: string;
  public lintGitRepoResponse: LintGitRepoResponse;

  constructor(@Inject(API_URL) public readonly apiUrl: string) {
    const loggerOpts: ILoggerOptions = {
      label: "lint-git-repo-page",
      level: "TRACE",
    };
    this.log = LoggerProvider.getOrCreate(loggerOpts);

    this.log.debug(`constructor() applying default API host: ${apiUrl}`);
    this.apiHost = apiUrl;
    this.gitCloneUrl = "https://github.com/hyperledger/cactus.git";
  }

  public ngOnInit(): void {
    this.gitCloneUrl = "https://github.com/hyperledger/cactus.git";
  }

  public onChangeApiHost(): void {
    this.log.debug(`onChangeApiHost() apiHost=${this.apiHost}`);
  }

  public async onBtnClickLint(): Promise<void> {
    this.log.debug(`onBtnClickLint() gitCloneUrl=${this.gitCloneUrl}`);
    const config = new Configuration({ basePath: this.apiUrl });
    const api = new DciLintApi(config);

    this.log.info(`targetPhrasePatternsCsv=${this.targetPhrasePatternsCsv}`);

    this.targetPhrasePatterns = this.targetPhrasePatternsCsv.split(",");

    const { data, status } = await api.lintGitRepoV1({
      cloneUrl: this.gitCloneUrl,
      targetPhrasePatterns: this.targetPhrasePatterns,
    });
    this.log.debug(`LintGitRepo Status: ${status}`);

    this.log.debug(`LintGitRepo Data: ${JSON.stringify(data, null, 4)}`);
    this.lintGitRepoResponse = data;
  }
}
