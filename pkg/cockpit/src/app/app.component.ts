import { Component, OnInit, Inject } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { LoggerProvider, Logger } from "@dci-lint/common";
import { ApiClient, Configuration } from "@dci-lint/api-client";
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
      title: "Consortiums",
      url: "/consortiums-inspector",
      icon: "color-filter",
    },
  ];

  private readonly log: Logger;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    @Inject(API_URL) public readonly ApiUrl: string
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
    const configuration = new Configuration({ basePath: this.ApiUrl });
    // const res = await apiClient.apiv1something();
    // const resHealthCheck = await apiClient.apiV1ApiServerHealthcheckGet();
    // this.log.info(`ConsortiumNodeJwtGet`, res.data);
    // this.log.info(`ApiServer HealthCheck Get:`, resHealthCheck.data);
  }
}
