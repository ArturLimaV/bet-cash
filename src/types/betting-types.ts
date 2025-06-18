export interface Bet {
  odd: string;
  value: string;
  type: string;
  cashback: string;
  stake: string;
  lastEditedField?: 'value' | 'stake';
  houseName?: string;
  boost?: string;
  commission?: boolean;
  freebet?: boolean;
}

export interface TableRowData {
  index: number;
  value: number;
  percentage: string;
  retorno: number;
  lucro: number;
  lucroClass: string;
  betType?: string;
  layStake?: number;
  cashbackValue?: number;
  houseName?: string;
}
