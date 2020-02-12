import { browser, logging } from 'protractor';
import { AppPage } from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(async () => {
        page = new AppPage();
    });

    it('test banner', async () => {
        await page.navigateTo();
        await expect(await page.getHeaderText()).toEqual('3D Library – Explore And Collect');
    });

    it('test overview', async () => {
        await page.navigateTo();
        await expect(await page.getPanelTitlebarText()).toEqual('Hummingbird');
    });

    xit('test detailview', async () => {
        await page.navigateTo('/detail/5e418bd4163c761078f1cad7');
        await expect(await page.getPanelTitlebarText()).toEqual('Bee');
    });

    it('test 404 page', async () => {
        await page.navigateTo('/thisIsNotAValidUrl');
        await expect(await page.isOopsPresent()).toBeTruthy();
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
            level: logging.Level.SEVERE,
        } as logging.Entry));
    });
});
