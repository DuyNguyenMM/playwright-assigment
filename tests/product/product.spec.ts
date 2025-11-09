import { test } from "@playwright/test";
import dotenv from 'dotenv';
import { generateData } from "../../utils/data-handler/json-parser";
import { readJsonDataFile } from "@/utils/data-handler/file-handler";
import { DashboardPage } from "@/pages/dashboard/page";
import { ProductPage } from "@/pages/product/page";
dotenv.config();

let globalData: any;
let testData: any;

test.describe('Product Tests', { tag: ['@product'] }, () => {

    test.beforeAll(async () => {
        generateData('product-template.json')
        globalData = readJsonDataFile('product.json');
    });

    let productPage: ProductPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }, testInfo) => {
        await page.goto('/');
        dashboardPage = new DashboardPage(page);
        productPage = new ProductPage(page);
        // Get test data based on tag
        const dataKey = Object.keys(globalData);
        const rawTags = testInfo.tags;
        const tags = rawTags.map(tag => tag.trim().replace('@', ''));
        const matchedTag = tags.filter(tag => dataKey.includes(tag));
        if (!matchedTag || matchedTag.length === 0) {
            throw new Error(`No matching tag ${matchedTag} found for test with tags: ${tags}`);
        }
        if (matchedTag) {
            testData = globalData[matchedTag[0]];
        } else {
            throw new Error(`No matching data found for test with tags: ${tags}`);
        }
    })

    test.afterEach(async () => {
        testData = {};
    });

    test('Verify that user can search existing product succeesfully', { tag: ["@search_1_001"] }, async () => {
        const expectedProductInfo = [testData['expected']];
        await dashboardPage.searchProduct(testData['input']['search']);
        await dashboardPage.selectProductFromSearchResultPage(testData['input']['search']);
        await productPage.verifyThatProductInformationShouldBeLoadedSuccessfully(expectedProductInfo)
    })

    test('Verify that user can view list product by sort price low to high ', { tag: ["@view_product_1_001"] }, async () => {
        await dashboardPage.selectProductCategoryFromMenu('Computers', 'Notebooks');
        await productPage.selectSortOptionToViewProduct('Price: Low to High');
        await productPage.waitForProductLoading();
        await productPage.verifyListOfProductShouldBeLoaded();
    })
});