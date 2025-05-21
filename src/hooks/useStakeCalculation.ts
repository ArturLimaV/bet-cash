
import { useEffect } from "react";
import { Bet } from "@/types/betting-types";

export function useStakeCalculation(
  data: Bet,
  onChange: (index: number, data: Bet) => void,
  index: number
) {
  // Calculate stake or value based on changes to the other field
  useEffect(() => {
    // Skip if odd is invalid
    const oddValue = parseFloat(data.odd);
    if (isNaN(oddValue) || oddValue <= 1) return;
    
    // Skip calculation if both fields are empty or if no field was edited yet
    if ((!data.value && !data.stake) || !data.lastEditedField) return;
    
    // Only perform auto-calculations for Lay bets
    if (data.type === 'Lay') {
      // Calculate based on which field was last edited
      if (data.lastEditedField === 'value') {
        // When value is changed, calculate stake
        const valueNum = parseFloat(data.value);
        if (!isNaN(valueNum) && valueNum > 0) {
          const stakeAmount = valueNum / (oddValue - 1);
          onChange(index, { ...data, stake: stakeAmount.toFixed(2), lastEditedField: 'value' });
        }
      } else if (data.lastEditedField === 'stake') {
        // When stake is changed, calculate value
        const stakeNum = parseFloat(data.stake);
        if (!isNaN(stakeNum) && stakeNum > 0) {
          const valueAmount = stakeNum * (oddValue - 1);
          onChange(index, { ...data, value: valueAmount.toFixed(2), lastEditedField: 'stake' });
        }
      }
    } else {
      // For Back bets, stake = value
      if (data.lastEditedField === 'value') {
        onChange(index, { ...data, stake: data.value, lastEditedField: 'value' });
      } else if (data.lastEditedField === 'stake') {
        onChange(index, { ...data, value: data.stake, lastEditedField: 'stake' });
      }
    }
  }, [data.value, data.stake, data.odd, data.type, data.lastEditedField, onChange, index]);
}
