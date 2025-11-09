import { readFileSync } from 'fs';
import fs from "fs";
import { findFileInData, findParentOfFile } from './file-handler';
import { faker } from '@faker-js/faker';
import { readJsonFile } from '../file-handler';


const generators = {
    random_email: () => {
        // const domains = ['example.com', 'test.com', 'demo.com', 'sample.com'];
        // const name = Math.random().toString(36).substring(2, 10);
        // return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
        return faker.internet.email();
    },
    random_firstname: () => {
        // const names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma', 'Robert', 'Olivia'];
        // return names[Math.floor(Math.random() * names.length)];
        return faker.person.firstName();
    },
    random_lastname: () => {
        // const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson'];
        // return names[Math.floor(Math.random() * names.length)];
        return faker.person.lastName();
    },
    random_company_name: () => {
        // const prefixes = ['Tech', 'Global', 'Digital', 'Smart', 'Prime', 'Meta'];
        // const suffixes = ['Corp', 'Solutions', 'Systems', 'Industries', 'Group', 'Labs'];
        // return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        return faker.company.name();
    },
    random_password: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    },
    random_phone: () => {
        // return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
        return faker.phone.number();
    },
    random_number: () => Math.floor(Math.random() * 1000),
    random_boolean: () => Math.random() > 0.5,
    random_string: () => Math.random().toString(36).substring(2, 15),
    random_gender: () => {
        const genders = ['Male', 'Female'];
        return genders[Math.floor(Math.random() * genders.length)];
    }
};

const supportRandomType = [
    '$random_email',
    '$random_firstname',
    '$random_lastname',
    '$random_company_name',
    '$random_password',
    '$random_phone',
    '$random_number',
    '$random_boolean',
    '$random_string',
    '$random_gender'
];

const replaceRandomValue = (randomString: string) => {
    return randomString.replace(/\$random_\w+/g, (match: any) => {
        if (!supportRandomType.includes(match)) {
            throw new Error(`Unsupported random type: ${match}`);
        }
        switch (match) {
            case "$random_email":
                return generators.random_email();
            case "$random_firstname":
                return generators.random_firstname();
            case "$random_lastname":
                return generators.random_lastname();
            case "$random_company_name":
                return generators.random_company_name();
            case "$random_password":
                return generators.random_password();
            case "$random_phone":
                return generators.random_phone();
            case "$random_number":
                return generators.random_number().toString();
            case "$random_boolean":
                return generators.random_boolean().toString();
            case "$random_string":
                return generators.random_string();
            case "$random_gender":
                return generators.random_gender();
            default:
                return match;
        };
    });
};

const readTemplate = (templateName: string): string => {
    const dataFilePath = findFileInData(templateName);
    if (!dataFilePath) {
        throw new Error(`Template file ${templateName} not found`);
    }
    const rawData = readFileSync(dataFilePath, 'utf8');
    const jsonString = JSON.stringify(rawData);
    const replacedJsonString = replaceRandomValue(jsonString);
    return replacedJsonString
};

const recursiveGetObjectValue = (obj: any, path: string[]): any => {
    if (path.length === 0) return obj;
    const [first, ...rest] = path;
    if (obj[first] !== undefined) {
        return recursiveGetObjectValue(obj[first], rest);
    }
    return null;
}

const reGenerateDataFile = (convertedJsonString: string, templateName: string) => {
    const dataFilePath = findFileInData(templateName);
    if (!dataFilePath) {
        throw new Error(`Template file ${templateName} not found`);
    }
    let parentPath = findParentOfFile(dataFilePath);
    const dataFileName = templateName.replace('-template', '-template-value');
    fs.writeFileSync(parentPath + "/" + dataFileName, JSON.parse(convertedJsonString), 'utf8');    
    return parentPath + "/" + dataFileName;
}

const parseValueFromJsonPath = (dataFilePath: string): string => {
    const templateValue = readJsonFile(dataFilePath);
    let convertedJsonString = JSON.stringify(templateValue);
    convertedJsonString = convertedJsonString.replace(/\$value=(\w+)>((?:\w+>?)*)/g, (match: any) => {
        if (match) {
            const path = match.replace('$value=', '').split('>');
            let value = recursiveGetObjectValue(templateValue, path);
            return value ?? match; 
        }
    });

    return convertedJsonString;
};

const generateData = (templateName: string) => {
    const convertedJsonString = readTemplate(templateName);
    const dataFilePath = reGenerateDataFile(convertedJsonString, templateName);
    const finalData = parseValueFromJsonPath(dataFilePath);
    const path = dataFilePath.replace('-template-value', '');
    fs.writeFileSync(path, (finalData), 'utf8');  
    return JSON.parse(convertedJsonString);
}

export { generateData, parseValueFromJsonPath }
