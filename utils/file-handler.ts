import { readFileSync } from "fs";

const readJsonFile = (filePath: string): any => {
  const rawData = readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

export { readJsonFile }