export interface IAccount {
  id: number;
  name: string;
  age: number;
  balance: number;
  previousBalance: number;
  averageBalane: number;
  freeTransfer: number;
}

export interface IResultEod extends IAccount {
  averageBalanceThreadNo?: number;
  updateFreeTransferThreadNo?: number;
  updateBalanceBonusThreadNo?: number;
  updateBalanceGiveawayThreadNo?: number;
}

export enum UpdateBalanceType {
  BONUS_FOR_EXCEED_BALANCE,
  GIVE_AWAY_FIRST_HUNDREED,
}

export enum EodProcessActivity {
  AVERAGE_BALANCE,
  UPDATE_FREE_TRANSFER,
  UPDATE_BALANCE,
  TRANSFORM_EOD_RESULT_TO_DOC,
}
