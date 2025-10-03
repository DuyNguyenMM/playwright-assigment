import { Page } from "@playwright/test";
import { locators } from "./locators";

export class RegisterActions{
    readonly page: Page;
    constructor(page: Page){
        this.page = page;
    };

    async selectGender(gender: string){
        await this.page.locator(locators.genderRadioButton(gender.toLowerCase())).click();
    };
    
    async toggleNewsLetter(isCheck: boolean){
        await this.page.locator(locators.newsLetterCheckbox).setChecked(isCheck);
    };

    async enterDataToTextfields(data: Record<string, any>){
        const locatorsKeys = Object.keys(locators);
        for (const key in data) {
            const value = data[key];
            const locatorKey = key + 'Textfield';
            if (!(locatorsKeys.includes(locatorKey))) {
                continue;
            }
            await this.page.locator(locators[locatorKey]).fill(value);
        }
    };

    async clickRegisterButton(){
        await this.page.locator(locators.registerButton).click();
    };

    async getRegisterSuccessMessage(){
        return this.page.locator(locators.registerSuccessMessage).textContent();
    };

    async continueButtonShouldBeVisible(){
        await this.page.getByRole('button', {name: 'Continue'}).isVisible();
    }
}