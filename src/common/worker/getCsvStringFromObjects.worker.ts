import { parentPort, workerData } from "worker_threads";
import { getCsvStringFromObjects } from "../utils";

export const CSV_STRING_FROM_OBJECTS_WORKER_PATH =
  "../common/worker/getCsvStringFromObjects.worker.js";

const getCsvStringFromObjectsWorker = (): string => {
  const objects: Object[] = workerData.objects;
  const includeHeader: boolean = workerData.includeHeader;
  return getCsvStringFromObjects(objects, includeHeader);
};

parentPort?.postMessage(getCsvStringFromObjectsWorker());
