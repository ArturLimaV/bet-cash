
import { Bet } from "@/types/betting-types";

export const calculateRealOdd = (bet: Bet): number => {
  // Se o campo de odd estiver vazio, retornar NaN
  if (bet.odd === "") return NaN;
  
  let rawOdd = parseFloat(bet.odd);
  
  // Return NaN for invalid odds to allow proper handling in components
  if (isNaN(rawOdd) || rawOdd <= 0) return NaN;
  
  let baseOdd = bet.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

  if (bet.hasCommission && bet.commission !== "") {
    const commissionValue = parseFloat(bet.commission);
    if (!isNaN(commissionValue)) {
      baseOdd = 1 + ((baseOdd - 1) * (1 - commissionValue / 100));
    }
  }
  
  // Apply increase if present (renamed from stakeIncrease to increase)
  const aumentoValue = parseFloat(bet.increase);
  if (!isNaN(aumentoValue) && aumentoValue > 0) {
    baseOdd = ((baseOdd - 1) * (1 + aumentoValue / 100)) + 1;
  }

  return baseOdd;
};
