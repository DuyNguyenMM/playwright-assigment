import { expect, Page } from "@playwright/test";
import { locators } from "./locators";

export class LoginActions {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async enterRecoverEmail(email: string) {
        await this.page.fill(locators.emailTextfield, email);
    }

    async clickForgotPasswordLink() {
        await this.page.getByRole('link', { name: locators.forgotPasswordLink }).click();
    }

    async pageTitleShouldBeVisible(title: string) {
        await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
    }

    async notificationTextShouldBeVisible(message: string) {
        await expect(this.page.locator(locators.notificationText)).toHaveText(message);
    }

    async clickRecoveryButton() {
        await this.page.getByRole('button', { name: locators.recoveryButton }).click();
    }
}