import fs, { readFileSync } from "fs";
import path from "path";

const findFileInData = (fileName: string, dir = path.resolve(__dirname, "../../data")): string | null => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const found = findFileInData(fileName, fullPath);
      if (found) return found;
    } else if (file === fileName) {
      return fullPath;
    }
  }

  return null;
}

const findParentOfFile = (filePath: string): string => {
  return path.dirname(filePath);
}

const readJsonDataFile = (filePath: string): any => {
  const dataFile = findFileInData(filePath);
  if (!dataFile) {
      throw new Error(`Data file ${filePath} not found`);
  }
  const rawData = readFileSync(dataFile, 'utf8');
  return JSON.parse(rawData);
}



export { findFileInData, findParentOfFile, readJsonDataFile }