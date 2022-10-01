import { EodProcessActivity } from "./account.type";
import { AVERAGE_BALANCE_WORKER_FILE_PATH } from "./eod-worker/averageBalance.worker";
import { TRANSFORM_EOD_RESULT_WORKER_PATH } from "./eod-worker/transformEodResultToRawDocs.worker";
import { UPDATE_BALANCE_WORKER_PATH } from "./eod-worker/updateBalance.worker";
import { UPDATE_FREE_TRANSFER_WORKER_PATH } from "./eod-worker/updateFreeTransfer.worker";

export const mapEodActivityEnumToPathWorker = new Map<
  EodProcessActivity,
  string
>([
  [EodProcessActivity.AVERAGE_BALANCE, AVERAGE_BALANCE_WORKER_FILE_PATH],
  [EodProcessActivity.UPDATE_FREE_TRANSFER, UPDATE_FREE_TRANSFER_WORKER_PATH],
  [EodProcessActivity.UPDATE_BALANCE, UPDATE_BALANCE_WORKER_PATH],
  [
    EodProcessActivity.TRANSFORM_EOD_RESULT_TO_DOC,
    TRANSFORM_EOD_RESULT_WORKER_PATH,
  ],
]);
