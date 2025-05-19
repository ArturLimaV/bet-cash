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

// Helper function to calculate stake based on bet type
export const calculateStake = (bet: Bet): number => {
  // If there's no value or it's empty, return 0
  if (!bet.value || bet.value === "") return 0;
  
  const value = parseFloat(bet.value);
  if (isNaN(value)) return 0;
  
  // For Lay bets, stake is always calculated as value / (odd - 1)
  if (bet.type === "Lay") {
    const odd = calculateRealOdd(bet);
    if (odd <= 1) return 0;
    return value / (odd - 1);
  }
  
  // For Back bets and other types, stake = value
  return value;
};
