import { parentPort, workerData } from "worker_threads";
import { IAccount, IResultEod, UpdateBalanceType } from "../account.type";

export const UPDATE_BALANCE_WORKER_PATH =
  "../account/eod-worker/updateBalance.worker.js";

const MINIMUM_BALANCE_TO_BE_PROCESS = 150;
const AMOUNT_BONUS_FOR_EXCEED_BALANCE = 25;
const AMOUNT_GIVE_AWAY_FIRST_HUNDREED = 10;

const updatedBalance = (
  updateType: UpdateBalanceType,
  currentBalance: number
): number => {
  if (updateType == UpdateBalanceType.BONUS_FOR_EXCEED_BALANCE) {
    return MINIMUM_BALANCE_TO_BE_PROCESS < currentBalance
      ? currentBalance + AMOUNT_BONUS_FOR_EXCEED_BALANCE
      : currentBalance;
  }
  return currentBalance + AMOUNT_GIVE_AWAY_FIRST_HUNDREED;
};

const addAmountToBalance = (): IResultEod[] => {
  const accounts: IAccount[] = workerData.accounts as IAccount[];
  const resultEod: IResultEod[] = accounts.map((account) => {
    const balance = updatedBalance(
      workerData.updateBalanceType,
      account.balance
    );

    let result: IResultEod = {
      ...account,
      balance,
    };

    switch (workerData.updateBalanceType) {
      case UpdateBalanceType.BONUS_FOR_EXCEED_BALANCE:
        result.updateBalanceBonusThreadNo = workerData.threadNo as number;
        break;
      case UpdateBalanceType.GIVE_AWAY_FIRST_HUNDREED:
        result.updateBalanceGiveawayThreadNo = workerData.threadNo as number;
        break;
      default:
        break;
    }

    return result;
  });

  return resultEod;
};

parentPort?.postMessage(addAmountToBalance());
