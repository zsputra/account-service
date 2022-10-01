import { parentPort, workerData } from "worker_threads";
import { AccountRawProperty } from "../account.constant";
import { IResultEod } from "../account.type";

export const TRANSFORM_EOD_RESULT_WORKER_PATH =
  "../account/eod-worker/transformEodResultToRawDocs.worker.js";

const transformEodResultToRawDocs = (): Object[] => {
  const eodResults: IResultEod[] = workerData.eodResults;
  const result = eodResults.map((eodResult) => {
    return {
      [AccountRawProperty.ID]: eodResult.id,
      [AccountRawProperty.NAME]: eodResult.name,
      [AccountRawProperty.AGE]: eodResult.age,
      [AccountRawProperty.BALANCE]: eodResult.balance,
      [AccountRawProperty.NO2B_THREAD_NO]:
        eodResult.updateBalanceBonusThreadNo || null,
      [AccountRawProperty.NO3_THREAD_NO]:
        eodResult.updateBalanceGiveawayThreadNo || null,
      [AccountRawProperty.PREVIOUS_BALANCE]: eodResult.previousBalance,
      [AccountRawProperty.AVERAGE_BALANCE]: eodResult.averageBalane,
      [AccountRawProperty.NO1_THREAD_NO]:
        eodResult.averageBalanceThreadNo || null,
      [AccountRawProperty.FREE_TRANSFER]: eodResult.freeTransfer,
      [AccountRawProperty.NO2A_THREAD_NO]:
        eodResult.updateFreeTransferThreadNo || null,
    };
  });

  return result;
};

parentPort?.postMessage(transformEodResultToRawDocs());
