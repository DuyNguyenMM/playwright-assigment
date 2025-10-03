import { Page } from "@playwright/test";
import { locators } from "./locators";
import { ItemName } from "./schema";

export class DashboardActions {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async clickItemOnHeader(itemName: ItemName) {
        await this.page.getByRole('link', {name: locators[itemName]}).click();
    }

    async clickSearchButton() {
        await this.page.getByRole('button', { name: locators.searchButton}).click();
    }

    async clickOnProductTitleFromSearchResult(productName: string) {
        await this.page.locator(locators.searchResultTitle).getByRole('link', {name: productName}).click();
    }


    async enterDataToTextfields(data: Record<string, any>){
            const locatorsKeys = Object.keys(locators);
            for (const key in data) {
                const value = data[key];
                const locatorKey = key + 'Textfield';
                if (!(locatorsKeys.includes(locatorKey))) {
                    continue;
                }
                await this.page.locator(locators[locatorKey]).fill(value);
            }
        };

    async clickOnProductLinkFromSearchResult(productName: string) {
        await this.page.locator(locators.searchResultDropdownList).locator(`span:has-text(${productName})`).click();
    }
}