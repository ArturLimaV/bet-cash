
import { Bet } from "@/types/betting-types";

export const calculateRealOdd = (bet: Bet): number => {
  let rawOdd = parseFloat(bet.odd);
  let baseOdd = bet.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

  if (bet.hasCommission && bet.commission !== "") {
    const commissionValue = parseFloat(bet.commission);
    if (!isNaN(commissionValue)) {
      baseOdd = 1 + ((baseOdd - 1) * (1 - commissionValue / 100));
    }
  }
  
  // Apply stake increase if present
  if (bet.stakeIncrease && bet.stakeIncrease !== "") {
    const increaseValue = parseFloat(bet.stakeIncrease);
    if (!isNaN(increaseValue)) {
      baseOdd = ((baseOdd - 1) * (1 + (increaseValue / 100))) + 1;
    }
  }

  return baseOdd;
};
