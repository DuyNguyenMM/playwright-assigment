import {test} from "@playwright/test";
import { RegisterPage } from "../../pages/authentication/register/page";
import dotenv from 'dotenv';
import { generateData } from "../../utils/data-handler/json-parser";
import { readJsonDataFile } from "@/utils/data-handler/file-handler";
dotenv.config();

let globalData: any;
let testData: any;

test.describe('Register Tests', {tag: ['@register', '@authentication']},  () => {

    test.beforeAll(async () => {
        generateData('register-template.json')
        globalData = readJsonDataFile('register.json');
    });

    let registerPage: RegisterPage;
    test.beforeEach(async ({ page }, testInfo) => {
        await page.goto('/');
        registerPage = new RegisterPage(page);
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

    test('Verify that user can register new user successfully', {tag: ["@register_1_001"]}, async ({ page }) => {
        await registerPage.SelectRegisterItemOnHeader();
        await registerPage.FillDataToRegisterForm(testData['input']);
        await registerPage.verifyNewUserIsRegistered(testData['expected']['message']);
    })
});