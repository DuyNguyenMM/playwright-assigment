import { Page } from "@playwright/test";

type AllowedLocatorType = 'Button' | 'Item' | 'RadioButton' | 'CheckBox' | 'Dropdown' | 'Link' | 'TextArea' | 'Image' | 'Label' | 'Table' | 'Tab' | 'Icon' | 'Menu' | 'Section' | 'Div' | 'Span' | 'Input' | 'TextField';
type LocatorDef = string | ((param?: string) => any);
const AllowedLocatorTypeList: AllowedLocatorType[] = [
  'Button','Item','RadioButton','CheckBox','Dropdown',
  'Link','TextArea','Image','Label','Table',
  'Tab','Icon','Menu','Section','Div','Span'
];

export class LocatorHandler {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async splitLocator(locator: string): Promise<[string, AllowedLocatorType]> {
        const regex = new RegExp(`(${AllowedLocatorTypeList.join('|')})$`);
        const match = locator.match(regex);

        if (!match) {
            throw new Error(`Locator "${locator}" does not end with a valid type`);
        }

        const type = match[1] as AllowedLocatorType;
        const name = locator.slice(0, -type.length);

        return [name.charAt(0).toLowerCase() + name.slice(1), type];
    }

    async buildLocatorMapping(locators: Record<string, string>) {
        const mapping: Record<string, string> = {};

        Object.keys(locators).forEach(async (locatorKey) => {
            const [name] = await this.splitLocator(locatorKey); // e.g. "usernameTextfield" → ["username", "Textfield"]
            mapping[name] = locatorKey;              // "username" → "usernameTextfield"
        });

        return mapping;
    }


    async performActionOnLocator(element: string, elementDef: LocatorDef, data: string): Promise<void> {
        const locatorType = this.splitLocator(element)[1] as AllowedLocatorType;

        // 🔹 Handle dynamic vs static locator
        const locator = typeof elementDef === "function" ? elementDef(data) : elementDef;
        switch (locatorType as AllowedLocatorType) {
            case 'Button':
            case 'Item':
            case 'CheckBox':
            case 'Dropdown':
            case 'Link':
            case 'Image':
            case 'Label':
            case 'Table':
            case 'Tab':
            case 'Icon':
            case 'Menu':
            case 'Section':
            case 'Div':
            case 'Span':
                await this.page.click(element);
                break;

            case 'RadioButton':
                await this.page.locator(locator).click();

            case 'TextArea':
            case 'Input':
            case 'TextField':
                await this.page.fill(element, data)

            default:
                throw new Error(`Unsupported locator type: ${locatorType}`);
        }
    }
}
