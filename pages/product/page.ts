import { expect, Page } from "@playwright/test";
import { ProductActions } from "./actions";

export class ProductPage {
    readonly page: Page;
    readonly productActions: ProductActions;

    constructor(page: Page) {
        this.page = page;
        this.productActions = new ProductActions(page);
    };

    async verifyThatProductInformationShouldBeLoadedSuccessfully(productInfo: Record<string, string>[]){
        const actualProductInfo = await this.productActions.getProductDetail();
        expect(actualProductInfo).toEqual(productInfo);
    }

    async selectSortOptionToViewProduct(sortOption: string) {
        await this.productActions.selectSortOption(sortOption);
    }

    async waitForProductLoading(){
        expect(await this.productActions.getLoadProductStatus()).toEqual('loading');
        await this.productActions.waitForProductLoaded()
    }

    async verifyListOfProductShouldBeLoaded(){
        const actualListProduct = await this.productActions.getListProduct();
        console.log(actualListProduct)
    }

}