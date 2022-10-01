import accountService from "./account/account.service";

import express from "express";

import { ACCOUNT_CSV_OUTPUT_NAME } from "./account/account.constant";

const app = express();
const port = "8080";

app.get("/process-eod", async (_, res) => {
  const csv = await accountService.processEodAccounts();
  res.attachment(ACCOUNT_CSV_OUTPUT_NAME).send(csv);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
