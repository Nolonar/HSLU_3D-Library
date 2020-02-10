import { browser, by, element } from 'protractor';

export class AppPage {

    async getUrl(): Promise<string> {
        return browser.getCurrentUrl();
    }

    async navigateTo(url: string = ''): Promise<void> {
        return browser.get(browser.baseUrl + url);
    }

    async getHeaderText(): Promise<string> {
        return element(by.css('h1')).getText();
    }

    async clickPanel(): Promise<void> {
        return element(by.css('.panel')).click();
    }

    async getTitlebarText(): Promise<string> {
        return element(by.css('.titlebar')).getText();
    }

    async getInfoText(): Promise<string> {
        return element(by.css('.info')).getText();
    }

    async isOopsPresent(): Promise<boolean> {
        return element(by.css('.oops')).isPresent();
    }
}
