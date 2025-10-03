import { Page } from "@playwright/test";
import { locators } from "./locators";
import { ItemName } from "./schema";

export class ProductActions {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
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
}