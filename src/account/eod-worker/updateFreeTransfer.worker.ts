import { parentPort, workerData } from "worker_threads";
import { IAccount, IResultEod } from "../account.type";

export const UPDATE_FREE_TRANSFER_WORKER_PATH =
  "../account/eod-worker/updateFreeTransfer.worker.js";

const MINIMUM_BALANCE_TO_BE_PROCESS = 100;
const MAXIMUM_BALANCE_TO_BE_PROCESS = 150;
const FEE_TRANSFER_TO_UPDATE = 5;

const updateFeeTransfer = (): IResultEod[] => {
  const accounts: IAccount[] = workerData.accounts as IAccount[];

  const resultEod: IResultEod[] = accounts.map((account) => {
    const freeTransfer =
      MINIMUM_BALANCE_TO_BE_PROCESS <= account.balance &&
      account.balance <= MAXIMUM_BALANCE_TO_BE_PROCESS
        ? FEE_TRANSFER_TO_UPDATE
        : account.freeTransfer;

    return {
      ...account,
      freeTransfer,
      updateFreeTransferThreadNo: workerData.threadNo as number,
    };
  });

  return resultEod;
};

parentPort?.postMessage(updateFeeTransfer());
