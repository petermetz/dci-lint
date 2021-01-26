import "@angular/compiler";
import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Logger, LoggerProvider } from "@dci-lint/common";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { API_URL } from "../constants";
import { LintGitRepoPageRoutingModule } from "./lint-git-repo/lint-git-repo-routing.module";

LoggerProvider.setLogLevel("TRACE");

const log: Logger = LoggerProvider.getOrCreate({ label: "app-module" });

log.debug("Running AppModule...");
const ApiUrl = location.origin;
log.debug("API_URL=%o", ApiUrl);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    LintGitRepoPageRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: API_URL,
      useValue: ApiUrl,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
