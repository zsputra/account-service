import * as fs from "fs";
import path from "path";
import { Worker } from "worker_threads";
import { CsvConfig } from "./constant";

export const parseToInt = (
  string: string | undefined,
  defaultValue: number = 0
) => parseInt(string?.trim() || defaultValue.toString());

export const parseToFloat = (
  string: string | undefined,
  defaultValue: number = 0
) => parseFloat(string?.trim() || defaultValue.toString());

export const writeToJson = (object: any, outputPath: string) => {
  let json = JSON.stringify(object);
  fs.writeFileSync(outputPath, json);
};

export const getCsvStringFromObjects = <T extends Object>(
  objects: T[],
  includeHeader: boolean = false,
  options?: {
    delimiter?: string;
    lineSeparator?: string;
  }
): string => {
  if (objects.length == 0) return "";
  const delimiter =
    (options && options.delimiter) || CsvConfig.CSV_DEFAULT_DELIMITER;
  const lineSeparator =
    (options && options.lineSeparator) || CsvConfig.CSV_DEFAULT_LINE_SEPARATOR;

  const propertyNames = Object.keys(objects[0]);

  let csvString = includeHeader ? propertyNames.join(delimiter) : "";

  for (const object of objects) {
    const values: string = propertyNames
      .map((propertyName) => `${object[propertyName as keyof T]}`)
      .join(delimiter);
    csvString = csvString.concat(`${lineSeparator}${values}`);
  }
  return csvString;
};

export const createWorker = (workerData: object, filePath: string) =>
  new Promise((resolve, reject): void => {
    if (filePath.length == 0) return;
    const worker = new Worker(path.resolve(__dirname, filePath), {
      workerData,
    });
    worker.on("message", (data) => resolve(data));
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
