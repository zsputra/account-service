import * as fs from "fs";
import { CsvConfig } from "../common/constant";
import { parseToFloat, parseToInt } from "../common/utils";
import { AccountRawProperty } from "./account.constant";
import { IAccount } from "./account.type";

const getStringContents = (filePath: string): string[] => {
  const csv = fs.readFileSync(filePath, { encoding: "utf8" });
  const contents: string[] = csv
    .toString()
    .split(CsvConfig.CSV_DEFAULT_LINE_SEPARATOR);
  return contents;
};

const convertToObjectAccount = (
  header: string,
  contents: string[]
): IAccount[] => {
  const accounts: IAccount[] = [];
  const delimiter = CsvConfig.CSV_DEFAULT_DELIMITER;
  const headers = header.split(delimiter);
  for (const content of contents) {
    const values = content.split(delimiter);
    if (content.trim().length !== 0)
      accounts.push({
        id: parseToInt(values[headers.indexOf(AccountRawProperty.ID)]),
        name: values[headers.indexOf(AccountRawProperty.NAME)],
        age: parseToInt(values[headers.indexOf(AccountRawProperty.AGE)]),
        balance: parseToFloat(
          values[headers.indexOf(AccountRawProperty.BALANCE)]
        ),
        previousBalance: parseToFloat(
          values[headers.indexOf(AccountRawProperty.PREVIOUS_BALANCE)]
        ),
        averageBalane: parseToFloat(
          values[headers.indexOf(AccountRawProperty.AVERAGE_BALANCE)]
        ),
        freeTransfer: parseToFloat(
          values[headers.indexOf(AccountRawProperty.FREE_TRANSFER)]
        ),
      });
  }
  return accounts;
};

const geAccountsFromFile = async (filePath: string): Promise<IAccount[]> => {
  const contents = getStringContents(filePath);
  const header = contents[0];
  return convertToObjectAccount(header, contents.splice(1));
};

const accountRepository = {
  geAccountsFromFile,
};

export default accountRepository;
