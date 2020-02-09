import { browser, by, element } from 'protractor';

export class AppPage {
    async navigateTo(): Promise<void> {
        return browser.get(browser.baseUrl);
    }

    async getHeaderText(): Promise<string> {
        return element(by.css('h1')).getText();
    }
}
