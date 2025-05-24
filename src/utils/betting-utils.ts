
import { Bet } from "@/types/betting-types";

export const calculateRealOdd = (bet: Bet): number => {
  // Se o campo de odd estiver vazio, retornar NaN
  if (bet.odd === "") return NaN;
  
  let rawOdd = parseFloat(bet.odd);
  
  // Return NaN for invalid odds to allow proper handling in components
  if (isNaN(rawOdd) || rawOdd <= 0) return NaN;
  
  // For Lay bets, convert the odd
  let baseOdd = bet.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

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
    const rawOdd = parseFloat(bet.odd);
    if (isNaN(rawOdd) || rawOdd <= 1) return 0;
    
    return value / (rawOdd - 1);
  }
  
  // For Back bets and other types, stake = value
  return value;
};

// Helper function to calculate cashback value
export const calculateCashback = (bet: Bet): number => {
  if (!bet.cashback || bet.cashback === "" || !bet.value || bet.value === "") return 0;
  
  const cashbackPercentage = parseFloat(bet.cashback);
  const betValue = parseFloat(bet.value);
  
  if (isNaN(cashbackPercentage) || isNaN(betValue)) return 0;
  
  return (betValue * cashbackPercentage) / 100;
};
