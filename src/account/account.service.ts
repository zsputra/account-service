import accountRepository from "./account.repository";
import { ACCOUNT_CSV_FILE_PATH } from "./account.constant";
import accountEodExecutor from "./accountEodExecutor.service";
import { IAccount } from "./account.type";

const getAllAccounts = async (): Promise<IAccount[]> =>
  await accountRepository.geAccountsFromFile(ACCOUNT_CSV_FILE_PATH);

const processEodAccounts = async (): Promise<string> => {
  console.log("Starting The EOD Process");

  const accounts = await getAllAccounts();
  const THREAD_SIZED = 5;

  //Average Balance
  const averageBalanceResults = await accountEodExecutor.processAverageBalance(
    accounts,
    THREAD_SIZED
  );

  //Update Free Transfer
  const updateFreeTransferResults =
    await accountEodExecutor.processUpdateFreeTransfer(
      averageBalanceResults,
      THREAD_SIZED
    );

  //Update Balance For Bonus (for Eligilble Accounts Only)
  const updateBalanceBonusResults =
    await accountEodExecutor.processUpdateBalanceForBonus(
      updateFreeTransferResults,
      THREAD_SIZED
    );

  //Update Balance For Giveaway (Only For the first 100 Account)
  const eodResults = await accountEodExecutor.processUpdateBalanceForGiveaway(
    updateBalanceBonusResults,
    8
  );

  //Transform Result to Raw Document
  const transormResultToRawResults =
    await accountEodExecutor.processTransformResultToDoc(
      eodResults,
      THREAD_SIZED
    );

  //Write to Csv File
  const csvString = await accountEodExecutor.processWriteResultToCsv(
    transormResultToRawResults
  );

  console.log("Finish The EOD Process");

  return csvString;
};

const accountService = {
  processEodAccounts,
};

export default accountService;
