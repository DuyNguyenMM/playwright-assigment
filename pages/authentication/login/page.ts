import { Page } from "@playwright/test";
import { locators } from "./locators";
import { LoginActions } from "./actions";

export class LoginPage{
    readonly page: Page;
    readonly loginActions: LoginActions;
    constructor(page: Page){
        this.page = page;
        this.loginActions = new LoginActions(page);
    }

    async enterRecoverEmail(email: string){
        await this.loginActions.enterRecoverEmail(email);
    }

    async navigateToForgotPasswordPage(){
        await this.loginActions.clickForgotPasswordLink();
    }

    async sendRequestRecoveryPassword(){
        await this.loginActions.clickRecoveryButton();
    }

    async verifyForgotPasswordPageIsDisplayed(title: string){
        await this.loginActions.pageTitleShouldBeVisible(title);
    }

    async verifyRequestRecoveryPasswordIsSent(message: string){
        await this.loginActions.notificationTextShouldBeVisible(message);
    }
}