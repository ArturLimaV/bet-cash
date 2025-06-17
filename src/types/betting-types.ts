
export interface Bet {
  odd: string;
  value: string;
  type: string;
  cashback: string; // Added cashback field (percentage)
  stake: string; // Added stake field for Lay bets
  lastEditedField?: 'value' | 'stake'; // Track which field was last edited
  houseName?: string; // Added house name field
}

export interface TableRowData {
  index: number;
  value: number;
  percentage: string;
  retorno: number;
  lucro: number;
  lucroClass: string;
  betType?: string; // Add bet type information
  layStake?: number; // Add lay stake value if applicable
  cashbackValue?: number; // Add cashback value for display
  houseName?: string; // Add house name for display
}
