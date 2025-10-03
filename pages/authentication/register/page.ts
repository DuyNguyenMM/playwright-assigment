import { Page } from "@playwright/test";
import { locators } from "./locators";
import { IRegisterForm } from "./interface";
import { LocatorHandler } from "../../../utils/locatorHandler";
import { RegisterActions } from "./actions";

export class RegisterPage{
    readonly page: Page;
    readonly locatorHandler: LocatorHandler;
    readonly actions: RegisterActions;
    constructor(page: Page) {
        this.page = page;
        this.locatorHandler = new LocatorHandler(page);
        this.actions = new RegisterActions(page);
    };

    async SelectRegisterItemOnHeader(){
        await this.page.getByRole('link', {name: locators.registerItem}).click();
    };

    async FillDataToRegisterForm(data: Record<string, any>){
        await this.actions.selectGender(data.gender!);
        await this.actions.toggleNewsLetter(data.newsLetter!);
        await this.actions.enterDataToTextfields(data);
        await this.actions.clickRegisterButton();
    };

    async verifyUserOnRegisterPage(){
        await this.page.waitForURL('**/register');
        await this.page.getByRole('heading', {name: 'Register'}).isVisible();
    };

    async verifyNewUserIsRegistered(expectedMessage: string){
        await this.actions.getRegisterSuccessMessage().then((actualMessage) => {
            if(actualMessage?.trim() !== expectedMessage){
                throw new Error(`Register success message mismatch! Expected: "${expectedMessage}", Actual: "${actualMessage}"`);
            };
        });
        await this.actions.continueButtonShouldBeVisible
    };
};