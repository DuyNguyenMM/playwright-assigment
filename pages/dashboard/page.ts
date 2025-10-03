import { Page } from "@playwright/test";
import { DashboardActions } from "./actions";
import { ItemName } from "./schema";

export class DashboardPage {
    readonly page: Page;
    readonly dasboardActions: DashboardActions;
    constructor(page: Page) {
        this.page = page;
        this.dasboardActions = new DashboardActions(page);
    };

    async selectItemOnHeader(itemName: ItemName){
        this.dasboardActions.clickItemOnHeader(itemName);
    }

    async searchProduct(productName: string){
        await this.dasboardActions.enterDataToTextfields({search: productName});
        await this.dasboardActions.clickSearchButton();
    }

    async selectProductFromSearchResultPage(productName: string){
        await this.dasboardActions.clickOnProductTitleFromSearchResult(productName);
    }

    async selectProductFromSearchResult(productName: string){
        await this.dasboardActions.clickOnProductLinkFromSearchResult(productName);
    }
}