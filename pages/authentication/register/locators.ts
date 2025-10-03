export const locators = {
    registerItem: 'Register',
    genderRadioButton: (genderValue: string) => `#gender-${genderValue}`,
    firstNameTextfield: '#FirstName',
    lastNameTextfield: '#LastName',
    emailTextfield: '#Email',
    companyNameTextfield: '#Company',
    newsLetterCheckbox: '#Newsletter',
    passwordTextfield: '#Password',
    confirmPasswordTextfield: '#ConfirmPassword',
    registerButton: '#register-button',
    registerSuccessMessage: '.result',
} as const;