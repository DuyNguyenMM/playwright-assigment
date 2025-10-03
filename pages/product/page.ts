import { expect, Page } from "@playwright/test";
import { ProductActions } from "./actions";
import { ItemName } from "./schema";

export class ProductPage {
    readonly page: Page;
    readonly productActions: ProductActions;

    constructor(page: Page) {
        this.page = page;
        this.productActions = new ProductActions(page);
    };

    async verifyThatProductInformationShouldBeLoadedSuccessfully(productInfo: Record<string, string>[]){
        const actualProductInfo = await this.productActions.getProductDetail();
        console.log(actualProductInfo)
        console.log(productInfo)
        expect(actualProductInfo).toEqual(productInfo);
    }
}