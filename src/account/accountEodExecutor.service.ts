import { CSV_STRING_FROM_OBJECTS_WORKER_PATH } from "../common/worker/getCsvStringFromObjects.worker";
import { createWorker } from "../common/utils";
import {
  EodProcessActivity,
  IAccount,
  IResultEod,
  UpdateBalanceType,
} from "./account.type";
import { mapEodActivityEnumToPathWorker } from "./account.uti";
import * as fs from "fs";
import { ACCOUNT_CSV_OUTPUT_FILE_PATH } from "./account.constant";

const createEodWorker = (data: object, eodActivity: EodProcessActivity) =>
  createWorker(data, mapEodActivityEnumToPathWorker.get(eodActivity) || "");

const createAverageBalanceWorker = (accounts: IAccount[], threadNo: number) =>
  createEodWorker({ accounts, threadNo }, EodProcessActivity.AVERAGE_BALANCE);

const createUpdateFreeTransferWorker = (
  accounts: IAccount[],
  threadNo: number
) =>
  createEodWorker(
    { accounts, threadNo },
    EodProcessActivity.UPDATE_FREE_TRANSFER
  );

const createUpdateBalanceWorker = (
  accounts: IAccount[],
  threadNo: number,
  updateBalanceType: UpdateBalanceType
) =>
  createEodWorker(
    { accounts, threadNo, updateBalanceType },
    EodProcessActivity.UPDATE_BALANCE
  );

const createTransformEodResultToRawWorker = (eodResults: IResultEod[]) =>
  createEodWorker(
    { eodResults },
    EodProcessActivity.TRANSFORM_EOD_RESULT_TO_DOC
  );

const createCsvStringFromObjectWorker = (
  objects: Object[],
  includeHeader: boolean = false
) =>
  createWorker({ objects, includeHeader }, CSV_STRING_FROM_OBJECTS_WORKER_PATH);

const getIndexContentsForWorker = (
  ithThread: number,
  threadSized: number,
  contentLength: number
): number[] => {
  const lengthFirstArray: number = Math.floor(contentLength / threadSized);
  if (contentLength >= threadSized) {
    const array = [
      (ithThread - 1) * lengthFirstArray,
      ithThread == threadSized ? contentLength : ithThread * lengthFirstArray,
    ];
    return array;
  }
  return [];
};

const processAverageBalance = async (
  accounts: IAccount[],
  threadSize: number
): Promise<IResultEod[]> => {
  const workerIndexes = Array.from({ length: threadSize }, (_, i) =>
    getIndexContentsForWorker(i + 1, threadSize, accounts.length)
  );
  const averageBalancePromises: Promise<any>[] = Array.from(
    { length: threadSize },
    (_, i: number) => {
      if (workerIndexes[i].length == 0) {
        return new Promise((resolve, _) => resolve([]));
      }
      return createAverageBalanceWorker(
        accounts.slice(workerIndexes[i][0], workerIndexes[i][1]),
        i + 1
      );
    }
  );

  return (await Promise.all(averageBalancePromises)).flatMap((c) => c);
};

const processUpdateFreeTransfer = async (
  accounts: IAccount[],
  threadSize: number
): Promise<IResultEod[]> => {
  const workerIndexes = Array.from({ length: threadSize }, (_, i) =>
    getIndexContentsForWorker(i + 1, threadSize, accounts.length)
  );
  const updateFreeTransferPromises: Promise<any>[] = Array.from(
    { length: threadSize },
    (_, i: number) => {
      if (workerIndexes[i].length == 0) {
        return new Promise((resolve, _) => resolve([]));
      }
      return createUpdateFreeTransferWorker(
        accounts.slice(workerIndexes[i][0], workerIndexes[i][1]),
        i + 1
      );
    }
  );

  return (await Promise.all(updateFreeTransferPromises)).flatMap((c) => c);
};

const processUpdateBalanceForBonus = async (
  accounts: IAccount[],
  threadSize: number
): Promise<IResultEod[]> => {
  const workerIndexes = Array.from({ length: threadSize }, (_, i) =>
    getIndexContentsForWorker(i + 1, threadSize, accounts.length)
  );
  const updateBalanceBonusPromises: Promise<any>[] = Array.from(
    { length: threadSize },
    (_, i: number) => {
      if (workerIndexes[i].length == 0) {
        return new Promise((resolve, _) => resolve([]));
      }
      return createUpdateBalanceWorker(
        accounts.slice(workerIndexes[i][0], workerIndexes[i][1]),
        i + 1,
        UpdateBalanceType.BONUS_FOR_EXCEED_BALANCE
      );
    }
  );

  return (await Promise.all(updateBalanceBonusPromises)).flatMap((c) => c);
};

const processUpdateBalanceForGiveaway = async (
  accounts: IAccount[],
  threadSize: number
): Promise<IResultEod[]> => {
  const eligibleAccountsToUpdate = accounts.slice(0, 100);

  const workerIndexesEligible = Array.from({ length: threadSize }, (_, i) =>
    getIndexContentsForWorker(
      i + 1,
      threadSize,
      eligibleAccountsToUpdate.length
    )
  );

  const updateBalanceGiveawayPromises: Promise<any>[] = Array.from(
    { length: threadSize },
    (_, i: number) => {
      if (workerIndexesEligible[i].length == 0) {
        return new Promise((resolve, _) => resolve([]));
      }
      return createUpdateBalanceWorker(
        eligibleAccountsToUpdate.slice(
          workerIndexesEligible[i][0],
          workerIndexesEligible[i][1]
        ),
        i + 1,
        UpdateBalanceType.GIVE_AWAY_FIRST_HUNDREED
      );
    }
  );

  const updateBalanceGiveawayResults: IResultEod[] = (
    await Promise.all(updateBalanceGiveawayPromises)
  ).flatMap((c) => c);

  return [...updateBalanceGiveawayResults, ...accounts.slice(100)];
};

const processTransformResultToDoc = async (
  accounts: IAccount[],
  threadSize: number
): Promise<IResultEod[]> => {
  const workerIndexes = Array.from({ length: threadSize }, (_, i) =>
    getIndexContentsForWorker(i + 1, threadSize, accounts.length)
  );

  const transormResultToRawPromises: Promise<any>[] = Array.from(
    { length: threadSize },
    (_, i: number) => {
      if (workerIndexes[i].length == 0) {
        return new Promise((resolve, _) => resolve([]));
      }
      return createTransformEodResultToRawWorker(
        accounts.slice(workerIndexes[i][0], workerIndexes[i][1])
      );
    }
  );

  return (await Promise.all(transormResultToRawPromises)).flatMap((c) => c);
};

const processWriteResultToCsv = async (
  accounts: IAccount[]
): Promise<string> => {
  const result: string = (await createCsvStringFromObjectWorker(
    accounts,
    true
  )) as string;

  fs.writeFileSync(ACCOUNT_CSV_OUTPUT_FILE_PATH, result);

  return result;
};

const accountEodExecutor = {
  processAverageBalance,
  processUpdateFreeTransfer,
  processUpdateBalanceForBonus,
  processUpdateBalanceForGiveaway,
  processTransformResultToDoc,
  processWriteResultToCsv,
};

export default accountEodExecutor;
