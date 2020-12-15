import { Component, OnInit, Inject } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { LoggerProvider, Logger } from "@dci-lint/common";
import { DefaultApi as DciLintApi, Configuration } from "@dci-lint/core-api";
import { API_URL } from "src/constants";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Lint Git Repo",
      url: "/git-repo-linter",
      icon: "color-filter",
    },
  ];

  private readonly log: Logger;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    @Inject(API_URL) public readonly apiUrl: string
  ) {
    this.log = LoggerProvider.getOrCreate({
      label: "app-component",
      level: "debug",
    });
    this.log.info("Initializing app...");
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.log.info("App initialized OK. Splashscreen was hidden.");
    });
  }

  ngOnInit() {
    this.testApi();
  }

  async testApi(): Promise<void> {
    const configuration = new Configuration({ basePath: this.apiUrl });
    const apiClient = new DciLintApi(configuration);
    const cloneUrl = "https://github.com/petermetz/random-english-words.git";

    const res = await apiClient.lintGitRepoV1({
      cloneUrl,
      targetPhrasePatterns: ["a65c92c0-f0a2-4d2b-9cb9-783a29318b39"],
    });
    this.log.info(`lintGitRepoV1`, res.data);
  }
}
