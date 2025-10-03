import {test} from "@playwright/test";
import { RegisterPage } from "../../pages/authentication/register/page";
import dotenv from 'dotenv';
import { generateData } from "../../utils/data-handler/json-parser";
import { readJsonDataFile } from "@/utils/data-handler/file-handler";
import { DashboardPage } from "@/pages/dashboard/page";
import { LoginPage } from "@/pages/authentication/login/page";
dotenv.config();

let globalData: any;
let testData: any;

test.describe('Login Tests', {tag: ['@login', '@authentication']},  () => {

    test.beforeAll(async () => {
        generateData('login-template.json')
        globalData = readJsonDataFile('login.json');
    });

    let registerPage: RegisterPage;
    let dashboardPage: DashboardPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }, testInfo) => {
        await page.goto('/');
        registerPage = new RegisterPage(page);
        dashboardPage = new DashboardPage(page);
        loginPage = new LoginPage(page);

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

    test('Verify that user can request to recovery password succeed', {tag: ["@login_1_001"]}, async ({ page }) => {
        // register first to ensure the email exists
        await registerPage.SelectRegisterItemOnHeader();
        await registerPage.FillDataToRegisterForm(testData['input']);
        await registerPage.verifyNewUserIsRegistered(testData['expected']['registerSuccessMessage']);

        // then logout and navigate to login page
        await dashboardPage.selectItemOnHeader('logoutItem');

        // navigate to forgot password page
        await dashboardPage.selectItemOnHeader('loginItem');
        await loginPage.navigateToForgotPasswordPage();
        await loginPage.enterRecoverEmail(testData['input']['recoveryEmail']);
        await loginPage.sendRequestRecoveryPassword();
        await loginPage.verifyRequestRecoveryPasswordIsSent(testData['expected']['recoverySuccessMessage']);
    })
});