import { browser, by, element } from "protractor";

export class AppPage {
  navigateTo(destination: string) {
    return browser.get(destination);
  }

  getParagraphText() {
    return element(by.deepCss("app-root ion-content")).getText();
  }
}
