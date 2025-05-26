
import { useState, useEffect } from "react";
import { Bet, TableRowData } from "@/types/betting-types";
import { calculateRealOdd, calculateCashback, calculateEffectiveOdd } from "@/utils/betting-utils";

export function useBetCalculations(numBets: number) {
  const [fixedStakeIndex, setFixedStakeIndex] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back",
    cashback: "",
    stake: ""
  })));

  const handleChange = (index: number, updatedBet: Bet) => {
    const updated = [...bets];
    updated[index] = updatedBet;
    setBets(updated);
  };

  // Auto-update when any bet changes
  useEffect(() => {
    if (fixedStakeIndex !== null) {
      distributeStakes(fixedStakeIndex);
    }
  }, [bets]);

  const handleFixStake = (fixedIndex: number) => {
    if (fixedStakeIndex === fixedIndex) {
      setFixedStakeIndex(null);
    } else {
      setFixedStakeIndex(fixedIndex);
      distributeStakes(fixedIndex);
    }
  };

  const handleUnfixStake = (index: number) => {
    if (fixedStakeIndex === index) {
      setFixedStakeIndex(null);
    }
  };

  const distributeStakes = (fixedIndex: number) => {
    const activeBets = bets.slice(0, numBets);
    const fixedBet = activeBets[fixedIndex];
    
    if (fixedBet.odd === "") return;
    
    const fixedEffectiveOdd = calculateEffectiveOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    const fixedCashback = parseFloat(fixedBet.cashback) || 0;
    
    if (isNaN(fixedEffectiveOdd) || fixedEffectiveOdd <= 0 || isNaN(fixedValue) || fixedValue <= 0) return;

    const fixedReturn = fixedEffectiveOdd * fixedValue;
    const fixedCashbackValue = (fixedValue * fixedCashback) / 100;

    const updated = activeBets.map((bet, i) => {
      if (i === fixedIndex) return bet;
      
      if (bet.odd === "") return bet;

      const effectiveOdd = calculateEffectiveOdd(bet);
      if (isNaN(effectiveOdd) || effectiveOdd <= 1) return bet;

      const cashbackPercentage = parseFloat(bet.cashback) || 0;
      
      let targetReturn;
      if (fixedReturn < fixedValue) {
        targetReturn = fixedReturn + fixedCashbackValue;
      } else {
        targetReturn = fixedReturn;
      }

      let newValue = targetReturn / effectiveOdd;
      
      if (targetReturn < newValue) {
        const cashbackValue = (newValue * cashbackPercentage) / 100;
        newValue = (targetReturn + cashbackValue) / effectiveOdd;
      }

      newValue = parseFloat(newValue.toFixed(2));
      
      const newBet = {
        ...bet,
        value: newValue.toFixed(2)
      };
      
      let newStake;
      if (bet.type === "Lay") {
        const rawOdd = parseFloat(bet.odd);
        if (!isNaN(rawOdd) && rawOdd > 1) {
          newStake = newValue / (rawOdd - 1);
        } else {
          newStake = 0;
        }
      } else {
        newStake = newValue;
      }
      
      return {
        ...newBet,
        stake: newStake.toFixed(2)
      };
    });

    const newBets = [...bets];
    updated.forEach((bet, i) => {
      if (i !== fixedIndex) {
        newBets[i] = {
          ...newBets[i],
          value: bet.value,
          stake: bet.stake
        };
      }
    });

    setBets(newBets);
  };

  const activeBets = bets.slice(0, numBets);
  
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (parseFloat(b.value) || 0);
  }, 0);
  
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    const cashbackValue = calculateCashback(bet);
    
    const retorno = odd * value;
    const betLost = retorno < totalInvested;
    const finalCashback = betLost ? cashbackValue : 0;
    const lucro = retorno - totalInvested + finalCashback;
    
    const percentage = totalInvested > 0 ? ((value / totalInvested) * 100).toFixed(2) : "0.00";
    const lucroClass = lucro >= 0 ? "text-green-400" : "text-red-400";
    
    let layStake = undefined;
    if (bet.type === "Lay") {
      if (bet.stake && parseFloat(bet.stake) > 0) {
        layStake = parseFloat(bet.stake);
      } else if (value > 0 && odd > 1) {
        layStake = value / (odd - 1);
      }
    } else {
      layStake = value;
    }
    
    return {
      index,
      value,
      percentage,
      retorno,
      lucro,
      lucroClass,
      betType: bet.type,
      layStake,
      cashbackValue: finalCashback
    };
  });
  
  const fixedReturns = activeBets.map((bet, index) => {
    if (bet.odd === "") return 0;
    
    const effectiveOdd = calculateEffectiveOdd(bet);
    const value = parseFloat(bet.value);
    if (isNaN(effectiveOdd) || !value) return 0;
    
    return effectiveOdd * value;
  });

  const minReturn = Math.min(...fixedReturns);
  const guaranteedProfit = minReturn - totalInvested;

  return {
    bets,
    activeBets,
    fixedStakeIndex,
    tableData,
    totalInvested,
    minReturn,
    guaranteedProfit,
    handleChange,
    handleFixStake,
    handleUnfixStake
  };
}
