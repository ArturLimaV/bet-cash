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
    type: "Back",
    cashback: "",
    stake: ""
  })));

  const handleChange = (index: number, updatedBet: Bet) => {
    const updated = [...bets];
    updated[index] = updatedBet;
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
    // Profit when fixed bet wins = (fixedValue * fixedOdd) + cashback_from_others - total_investment
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

      // When bet[i] wins, we need:
      // (value[i] * odd[i]) + cashback_from_others - total_investment = targetProfit - total_investment
      // Therefore: (value[i] * odd[i]) + cashback_from_others = targetProfit
      
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
          value: requiredValue.toFixed(2)
        };

        // Calculate stake for lay bets
        if (bet.type === "Lay") {
          const rawOdd = parseFloat(bet.odd);
          if (!isNaN(rawOdd) && rawOdd > 1) {
            const layStake = requiredValue / (rawOdd - 1);
            updated[i].stake = layStake.toFixed(2);
          }
        } else {
          updated[i].stake = requiredValue.toFixed(2);
        }
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
    // In this scenario: this bet returns money, all others lose but may have cashback
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
    
    // Calculate Lay Stake
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
      retorno: retornoSeGanhar, // Return when this bet wins
      lucro: lucroSeGanhar, // Profit when this bet wins (considering cashback from others)
      lucroClass,
      betType: bet.type,
      layStake,
      cashbackValue: retornoSePerder // Cashback when this bet loses
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
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4 relative">
      <div className="w-full max-w-xs md:max-w-full relative z-10">
        
      </div>
      
      <h1 className="text-3xl font-bold mb-8 relative z-10">Calculadora de Surebet</h1>

      <div className="mb-6 relative z-10">
        <label className="mr-4">Número de Casas:</label>
        <select
          value={numBets}
          onChange={(e) => {
            setNumBets(Number(e.target.value));
            setFixedStakeIndex(null); // Reset fixed stake quando mudar número de casas
          }}
          className="p-2 bg-[#2c3545] text-white rounded"
        >
          {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="flex gap-4 flex-wrap justify-center relative z-10">
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

      <BettingTable 
        tableData={tableData} 
        minReturn={minReturn}
        freebetIndexes={[]}
      />
      <ResultsSummary guaranteedProfit={guaranteedProfit} totalInvested={totalInvested} />

      <footer className="mt-10 text-center text-sm opacity-60 flex flex-col items-center relative z-10">
        <p className="mb-2">Nos siga no Instagram e Telegram</p>
        <div className="flex space-x-4">
          <a href="https://t.me/betsemmedofree" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            <MessageCircle size={isMobile ? 20 : 24} />
          </a>
          <a href="https://www.instagram.com/betsemmedo?igsh=MW1rcjM0Z3I2aTVsNw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
            <Instagram size={isMobile ? 20 : 24} />
          </a>
        </div>
      </footer>
    </div>
  );
}
