interface IRegisterForm {
    gender: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
    newsLetter: boolean;
    password: string;
    confirmPassword: string;
}

export { IRegisterForm };