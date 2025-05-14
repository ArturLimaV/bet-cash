
export interface Bet {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
  increase: string; // Changed from stakeIncrease to increase
}

export interface TableRowData {
  index: number;
  value: number;
  percentage: string;
  retorno: number;
  lucro: number;
  lucroClass: string;
}
