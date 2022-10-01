import { parentPort, workerData } from "worker_threads";
import { IAccount, IResultEod } from "../account.type";

export const AVERAGE_BALANCE_WORKER_FILE_PATH =
  "../account/eod-worker/averageBalance.worker.js";

const computeAverageBalance = (): IResultEod[] => {
  const accounts: IAccount[] = workerData.accounts as IAccount[];
  const resultProcess: IResultEod[] = accounts.map((account) => {
    const averagebalance = (account.balance + account.previousBalance) / 2;
    return {
      ...account,
      averageBalane: averagebalance,
      averageBalanceThreadNo: workerData.threadNo as number,
    };
  });

  return resultProcess;
};

parentPort?.postMessage(computeAverageBalance());
