
import React, { useState, useEffect } from "react";
import { BettingHouse } from "./BettingHouse";
import { BettingTable } from "./betting/BettingTable";
import { ResultsSummary } from "./betting/ResultsSummary";
import { Logo } from "./Logo";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bet, TableRowData } from "@/types/betting-types";
import { calculateRealOdd, calculateStake, calculateCashback, calculateEffectiveOdd } from "@/utils/betting-utils";

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

  // Function to distribute stakes based on the fixed stake
  const distributeStakes = (fixedIndex: number) => {
    const activeBets = bets.slice(0, numBets);
    const fixedBet = activeBets[fixedIndex];
    
    // Allow empty field temporarily - don't calculate anything in this case
    if (fixedBet.odd === "") return;
    
    const fixedEffectiveOdd = calculateEffectiveOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    
    // If unable to get valid odd or fixed value, do nothing
    if (isNaN(fixedEffectiveOdd) || fixedEffectiveOdd <= 0 || isNaN(fixedValue) || fixedValue <= 0) return;

    const fixedReturn = fixedEffectiveOdd * fixedValue;

    const updated = activeBets.map((bet, i) => {
      // Don't change the fixed bet's stake
      if (i === fixedIndex) return bet;
      
      // Check if the odd field is empty and don't calculate anything in that case
      if (bet.odd === "") return bet;

      const effectiveOdd = calculateEffectiveOdd(bet);
      // If the odd is not valid, don't try to calculate (allows free editing)
      if (isNaN(effectiveOdd) || effectiveOdd <= 1) return bet;

      // Calculate the value correctly using effective odd
      let newValue = fixedReturn / effectiveOdd;

      // Round to 2 decimal places for consistent display
      newValue = parseFloat(newValue.toFixed(2));
      
      // Create a new bet object with the updated value
      const newBet = {
        ...bet,
        value: newValue.toFixed(2)
      };
      
      // Calculate the stake correctly - for lay bets, this is ALWAYS value / (odd - 1)
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

    // Update the values of the stakes, preserving all other fields
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
  
  // Calculate total invested amount
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (parseFloat(b.value) || 0);
  }, 0);
  
  // Calculate table data for each bet outcome
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    const cashbackValue = calculateCashback(bet);
    
    // Calculate return - if this bet wins, use normal odd calculation
    const retorno = odd * value;
    
    // For profit calculation when this bet WINS
    const lucro = retorno - totalInvested;
    
    const percentage = totalInvested > 0 ? ((value / totalInvested) * 100).toFixed(2) : "0.00";
    const lucroClass = lucro >= 0 ? "text-green-400" : "text-red-400";
    
    // For apostas Lay, asseguramos que a stake seja calculada corretamente caso não exista
    let layStake = undefined;
    if (bet.type === "Lay") {
      // Se a stake já estiver definida, use-a; caso contrário, calcule
      if (bet.stake && parseFloat(bet.stake) > 0) {
        layStake = parseFloat(bet.stake);
      } else if (value > 0 && odd > 1) {
        // Calcular stake como: valor / (odd - 1)
        layStake = value / (odd - 1);
      }
    } else {
      // Para apostas Back, a stake é igual ao valor
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
      cashbackValue
    };
  });
  
  // Calculate fixed returns for each bet using effective odds
  const fixedReturns = activeBets.map((bet, index) => {
    // Ignore calculations for empty odd fields
    if (bet.odd === "") return 0;
    
    const effectiveOdd = calculateEffectiveOdd(bet);
    const value = parseFloat(bet.value);
    if (isNaN(effectiveOdd) || !value) return 0;
    
    // Calculate return using effective odd
    return effectiveOdd * value;
  });

  const minReturn = Math.min(...fixedReturns);
  const guaranteedProfit = minReturn - totalInvested;

  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4 relative">
      <div className="w-full max-w-xs md:max-w-full relative z-10">
        <Logo />
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
