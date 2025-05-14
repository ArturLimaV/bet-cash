
export interface Bet {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
  stakeIncrease: string;
}

export interface TableRowData {
  index: number;
  value: number;
  percentage: string;
  retorno: number;
  lucro: number;
  lucroClass: string;
}
