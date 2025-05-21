
import { useState, useEffect } from "react";
import { Bet } from "@/types/betting-types";
import { calculateRealOdd } from "@/utils/betting-utils";

export function useBetCalculations(
  data: Bet,
  isStakeFixed: boolean,
  onUnfixStake?: (index: number) => void,
  index?: number
) {
  // Track if values have been changed since fixing
  const [valuesChangedSinceFixing, setValuesChangedSinceFixing] = useState(false);
  
  // Reset the tracking state when the bet is fixed or unfixed
  useEffect(() => {
    if (isStakeFixed) {
      setValuesChangedSinceFixing(false);
    }
  }, [isStakeFixed]);
  
  // Calculando a odd real baseada nos valores atuais
  const calculateDisplayOdd = () => {
    let rawOdd = parseFloat(data.odd);
    if (isNaN(rawOdd) || rawOdd <= 0) return "Aguardando...";
    
    let baseOdd = data.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

    // Apply commission if present
    if (data.hasCommission && data.commission !== "") {
      const commissionValue = parseFloat(data.commission);
      if (!isNaN(commissionValue)) {
        baseOdd = 1 + ((baseOdd - 1) * (1 - commissionValue / 100));
      }
    }
    
    // Apply increase if present
    const aumentoValue = parseFloat(data.increase);
    let oddReal = baseOdd;
    if (!isNaN(aumentoValue) && aumentoValue > 0) {
      oddReal = ((baseOdd - 1) * (1 + aumentoValue / 100)) + 1;
    }

    return oddReal.toFixed(3);
  };

  const realOdd = calculateDisplayOdd();
  
  // Modified auto-unfixing logic - only unfix when values change after the bet has been fixed
  useEffect(() => {
    // Only apply when already fixed and values have changed since fixing
    if (data.type === 'Lay' && isStakeFixed && valuesChangedSinceFixing && onUnfixStake && index !== undefined) {
      onUnfixStake(index);
      setValuesChangedSinceFixing(false); // Reset after unfixing
    }
  }, [data.odd, data.value, data.stake, data.type, isStakeFixed, valuesChangedSinceFixing, onUnfixStake, index]);
  
  // Mark that values have changed since fixing
  const handleValueChange = () => {
    if (isStakeFixed) {
      setValuesChangedSinceFixing(true);
    }
  };

  return {
    realOdd,
    handleValueChange,
  };
}
