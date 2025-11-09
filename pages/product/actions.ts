import { expect, Page } from "@playwright/test";
import { locators } from "./locators";
import { ItemName } from "./schema";
import { getNumberInString } from "@/utils/string-handler";
import { error } from "console";

export class ProductActions {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async sortOptionMapping(sortOption: string) {
        switch (sortOption) {
            case 'Position':
                return '0';
            case 'Name: A to Z':
                return '5';
            case 'Name: Z to A':
                return '6'
            case 'Price: Low to High':
                return '10'
            case 'Price: High to Low':
                return '11'
            case 'Created on':
                return '15'
            default:
                throw new Error(`${sortOption} are not correct. Try again with correct one`)
        }
    }

    async getProductDetail(item: string[] = ['productNameLabel', 'productShortDescriptionLabel', 'productPriceLabel', 'productAdditionalDetailLabel', 'productDeliveryLabel', 'productMinQuantityLabel']): Promise<Record<string, string>[]> {
        const result: Record<string, string>[] = [];
        const detailProduct: Record<string, string> = {}
        for (const i of item) {
            if (Object.keys(locators).includes(i)) {
                const text = await this.page.locator((locators as any)[i]).innerText();
                detailProduct[i.replace('Label', '')] = text;
            } else {
                throw new Error(`Item ${i} is not defined in locators`);
            }
        }
        result.push(detailProduct);
        return result;
    };

    async selectSortOption(sortOption: string) {
        await this.page.locator(locators.sortByDropdownList).selectOption({ value: await this.sortOptionMapping(sortOption) });
    }

    async getLoadProductStatus(): Promise<string> {
        let status = 'loading';
        const loadingProduct = await this.page.locator(locators.loadingProductAnimation).getAttribute("style");
        if (loadingProduct === 'display: none;') {
            status = 'loaded';
        }
        return status;
    }

    async waitForProductLoaded(timeout: number = 10000): Promise<void> {
        const startTime = Date.now();

        while (true) {
            const status = await this.getLoadProductStatus();

            if (status === 'loaded') {
                return;
            }

            if (Date.now() - startTime >= timeout) {
                throw new Error(`Product is still loading after ${timeout}ms`);
            }

            await this.page.waitForTimeout(200);
        }
    }

    async getListProduct(): Promise<Record<string, string>[]> {
        const listProduct: Record<string, string>[] = []
        const products = await this.page.locator(locators.productListView).locator(locators.productItem).all();
        for (const product of products) {
            const detail: Record<string, string> = {};
            let rating = '';
            const rawRating = await product.locator(locators.productRating).getAttribute("style");
            if (rawRating) {
                const n = getNumberInString(rawRating)[0] / 20;
                if (n < 1 || n > 5) {
                    throw new Error(` Rating value: ${rawRating} is invalid.`)
                }
                rating = n.toString();
            }
            detail.title = await product.locator(locators.productTitle).innerText();
            detail.rating = rating;
            detail.price = await product.locator(locators.productPrice).innerText();
            listProduct.push(detail);
        }
        return listProduct
    }

    async verifyProductPriceIsSortByDownToHigh(listProduct: Record<string, string>[]){
        for (let i = 0; i < listProduct.length; i++) {
            if (listProduct[i] > listProduct[i+1]){
                throw new Error('List product is not arrange by price low to high')
            }
        }
    }
}