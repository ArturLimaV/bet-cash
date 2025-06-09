import React, { useState, useEffect } from "react";
import { BettingHouse } from "./BettingHouse";
import { BettingTable } from "./betting/BettingTable";
import { ResultsSummary } from "./betting/ResultsSummary";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bet, TableRowData } from "@/types/betting-types";
import { calculateRealOdd, calculateStake, calculateCashback } from "@/utils/betting-utils";

export default function SurebetCalculator() {
  const isMobile = useIsMobile();
  const [numBets, setNumBets] = useState(3);
  const [fixedStakeIndex, setFixedStakeIndex] = useState<number | null>(null);
  
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back", // Fixed as Back
    cashback: "",
    stake: "",
    houseName: ""
  })));

  const handleChange = (index: number, updatedBet: Bet) => {
    const updated = [...bets];
    // Ensure type is always "Back"
    updated[index] = { ...updatedBet, type: "Back" };
    setBets(updated);
  };

  // Atualização automática quando qualquer aposta mudar
  useEffect(() => {
    if (fixedStakeIndex !== null) {
      distributeStakes(fixedStakeIndex);
    }
  }, [bets]);

  const handleFixStake = (fixedIndex: number) => {
    // Se já estiver fixada neste índice, desmarcar
    if (fixedStakeIndex === fixedIndex) {
      setFixedStakeIndex(null);
    } else {
      // Caso contrário, fixar neste índice e distribuir as stakes
      setFixedStakeIndex(fixedIndex);
      distributeStakes(fixedIndex);
    }
  };

  // New function to handle unfixing the stake when odd is cleared
  const handleUnfixStake = (index: number) => {
    if (fixedStakeIndex === index) {
      setFixedStakeIndex(null);
    }
  };

  // Function to distribute stakes based on the fixed stake ensuring equal profit
  const distributeStakes = (fixedIndex: number) => {
    const activeBets = bets.slice(0, numBets);
    const fixedBet = activeBets[fixedIndex];
    
    // Allow empty field temporarily - don't calculate anything in this case
    if (fixedBet.odd === "" || fixedBet.value === "") return;
    
    const fixedOdd = calculateRealOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    
    // If unable to get valid odd or fixed value, do nothing
    if (isNaN(fixedOdd) || fixedOdd <= 0 || isNaN(fixedValue) || fixedValue <= 0) return;

    console.log("=== DISTRIBUTING STAKES ===");
    console.log("Fixed index:", fixedIndex, "Fixed value:", fixedValue, "Fixed odd:", fixedOdd);

    // Calculate what the target profit should be when the fixed bet wins
    let targetProfit = fixedValue * fixedOdd;
    
    // Add cashback from other bets that will lose
    activeBets.forEach((bet, i) => {
      if (i !== fixedIndex) {
        const cashbackPercentage = parseFloat(bet.cashback) || 0;
        const currentValue = parseFloat(bet.value) || 0;
        targetProfit += (currentValue * cashbackPercentage) / 100;
      }
    });

    console.log("Target return when fixed bet wins:", targetProfit);

    // Now calculate what values the other bets need to have so that when THEY win,
    // the profit is the same as when the fixed bet wins
    const updated = [...bets];
    
    activeBets.forEach((bet, i) => {
      if (i === fixedIndex) return; // Don't change the fixed bet
      
      if (bet.odd === "") return; // Skip empty odds
      
      const odd = calculateRealOdd(bet);
      if (isNaN(odd) || odd <= 0) return;

      // Calculate cashback from other losing bets (including the fixed one)
      let cashbackFromOthers = 0;
      
      // Cashback from fixed bet when it loses
      const fixedCashbackPercentage = parseFloat(fixedBet.cashback) || 0;
      cashbackFromOthers += (fixedValue * fixedCashbackPercentage) / 100;
      
      // Cashback from other bets (not including current bet i)
      activeBets.forEach((otherBet, j) => {
        if (j !== i && j !== fixedIndex) {
          const otherCashbackPercentage = parseFloat(otherBet.cashback) || 0;
          const otherValue = parseFloat(otherBet.value) || 0;
          cashbackFromOthers += (otherValue * otherCashbackPercentage) / 100;
        }
      });

      // We need: (value[i] * odd[i]) + cashbackFromOthers = targetProfit
      // Therefore: value[i] = (targetProfit - cashbackFromOthers) / odd[i]
      const requiredValue = (targetProfit - cashbackFromOthers) / odd;

      console.log(`Bet ${i}: odd=${odd}, required value=${requiredValue}, cashback from others=${cashbackFromOthers}`);

      if (requiredValue > 0) {
        updated[i] = {
          ...updated[i],
          value: requiredValue.toFixed(2),
          stake: requiredValue.toFixed(2) // For Back bets, stake = value
        };
      }
    });

    setBets(updated);
  };

  const activeBets = bets.slice(0, numBets);
  
  // Calculate total invested amount
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (parseFloat(b.value) || 0);
  }, 0);
  
  // Calculate table data for each bet outcome scenario
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    const cashbackPercentage = parseFloat(bet.cashback) || 0;
    
    // Calculate return when this bet WINS (normal return)
    const retornoSeGanhar = odd * value;
    
    // Calculate what happens when this bet LOSES (only cashback)
    const cashbackValue = (value * cashbackPercentage) / 100;
    const retornoSePerder = cashbackValue; // Only cashback when losing
    
    // Calculate profit when this specific bet WINS
    let lucroSeGanhar = retornoSeGanhar; // Return from winning bet
    
    // Add cashback from all OTHER losing bets
    activeBets.forEach((otherBet, otherIndex) => {
      if (otherIndex !== index) {
        const otherValue = parseFloat(otherBet.value) || 0;
        const otherCashbackPercentage = parseFloat(otherBet.cashback) || 0;
        const otherCashback = (otherValue * otherCashbackPercentage) / 100;
        lucroSeGanhar += otherCashback; // Add cashback from losing bets
      }
    });
    
    // Subtract total investment
    lucroSeGanhar -= totalInvested;
    
    const percentage = totalInvested > 0 ? ((value / totalInvested) * 100).toFixed(2) : "0.00";
    const lucroClass = lucroSeGanhar >= 0 ? "text-green-400" : "text-red-400";
    
    return {
      index,
      value,
      percentage,
      retorno: retornoSeGanhar,
      lucro: lucroSeGanhar,
      lucroClass,
      betType: bet.type,
      layStake: value, // For Back bets, layStake = value
      cashbackValue: retornoSePerder,
      houseName: bet.houseName || `Casa ${index + 1}`
    };
  });
  
  // Calculate guaranteed return/profit considering all scenarios
  const scenarios = activeBets.map((bet, index) => {
    const winningReturn = calculateRealOdd(bet) * (parseFloat(bet.value) || 0);
    const cashbackFromLosing = activeBets.reduce((acc, otherBet, otherIndex) => {
      if (otherIndex !== index) {
        const otherValue = parseFloat(otherBet.value) || 0;
        const otherCashbackPercentage = parseFloat(otherBet.cashback) || 0;
        return acc + (otherValue * otherCashbackPercentage) / 100;
      }
      return acc;
    }, 0);
    
    return winningReturn + cashbackFromLosing;
  });

  const minReturn = Math.min(...scenarios);
  const guaranteedProfit = minReturn - totalInvested;

  return (
    <div className="min-h-screen bg-betting-bg text-white flex flex-col items-center py-8 px-4 relative">
      <h1 className="text-3xl font-bold mb-8 relative z-10">Calculadora de Surebet</h1>

      <div className="mb-6 relative z-10">
        <label className="mr-4">Número de Casas:</label>
        <select
          value={numBets}
          onChange={(e) => {
            setNumBets(Number(e.target.value));
            setFixedStakeIndex(null);
          }}
          className="p-2 bg-betting-input text-white rounded"
        >
          {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="w-full max-w-7xl relative z-10 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
          {activeBets.map((bet, index) => (
            <BettingHouse
              key={index}
              index={index}
              data={bet}
              onChange={handleChange}
              onFixStake={handleFixStake}
              onUnfixStake={handleUnfixStake}
              isStakeFixed={fixedStakeIndex === index}
            />
          ))}
        </div>
      </div>

      <BettingTable 
        tableData={tableData} 
        minReturn={minReturn}
        freebetIndexes={[]}
      />
      <ResultsSummary guaranteedProfit={guaranteedProfit} totalInvested={totalInvested} />
    </div>
  );
}
