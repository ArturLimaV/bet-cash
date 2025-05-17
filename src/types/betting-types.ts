
export interface Bet {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
  increase: string; // Changed from stakeIncrease to increase
  stake: string; // Added stake field for Lay bets
  lastEditedField?: 'value' | 'stake'; // Track which field was last edited
}

export interface TableRowData {
  index: number;
  value: number;
  percentage: string;
  retorno: number;
  lucro: number;
  lucroClass: string;
}
