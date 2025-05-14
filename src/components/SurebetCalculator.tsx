
import React, { useState } from "react";
import { BettingHouse } from "./BettingHouse";
import { BettingTable } from "./betting/BettingTable";
import { ResultsSummary } from "./betting/ResultsSummary";
import { Logo } from "./Logo";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bet, TableRowData } from "@/types/betting-types";
import { calculateRealOdd } from "@/utils/betting-utils";

export default function SurebetCalculator() {
  const isMobile = useIsMobile();
  const [numBets, setNumBets] = useState(3);
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back",
    hasCommission: false,
    commission: "",
    hasFreebet: false,
    increase: "" // Changed from stakeIncrease to increase
  })));

  const handleChange = (index: number, updatedBet: Bet) => {
    const updated = [...bets];
    updated[index] = updatedBet;
    setBets(updated);
  };

  const handleFixStake = (fixedIndex: number) => {
    const activeBets = bets.slice(0, numBets);
    const fixedBet = activeBets[fixedIndex];
    const fixedOdd = calculateRealOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    if (!fixedOdd || !fixedValue || fixedValue < 0) return;

    const fixedReturn = fixedBet.hasFreebet
      ? (fixedOdd - 1) * fixedValue
      : fixedOdd * fixedValue;

    const updated = activeBets.map((bet, i) => {
      if (i === fixedIndex) return bet;

      const odd = calculateRealOdd(bet);
      if (!odd || odd <= 1) return bet;

      const newValue = bet.hasFreebet
        ? fixedReturn / (odd - 1)
        : fixedReturn / odd;

      return {
        ...bet,
        value: newValue.toFixed(2)
      };
    });

    setBets([...updated, ...bets.slice(numBets)]);
  };

  const activeBets = bets.slice(0, numBets);
  
  // Calculate total invested amount (excluding freebets)
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (!b.hasFreebet ? (parseFloat(b.value) || 0) : 0);
  }, 0);
  
  // Calculate table data for each bet outcome
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    
    // Calculate return based on whether it's a freebet or not
    const retorno = bet.hasFreebet 
      ? (odd - 1) * value 
      : odd * value;
    
    // For profit calculation, we only subtract the total investment
    const lucro = retorno - totalInvested;
    
    const percentage = totalInvested > 0 ? ((value / totalInvested) * 100).toFixed(2) : "0.00";
    const lucroClass = lucro >= 0 ? "text-green-400" : "text-red-400";
    
    return {
      index,
      value,
      percentage,
      retorno,
      lucro,
      lucroClass
    };
  });
  
  // Calculate fixed returns for each bet
  const fixedReturns = activeBets.map((bet, index) => {
    const odd = calculateRealOdd(bet);
    const value = parseFloat(bet.value);
    if (!odd || !value) return 0;
    
    // Calculate return based on whether it's a freebet or not
    return bet.hasFreebet ? (odd - 1) * value : odd * value;
  });

  const minReturn = Math.min(...fixedReturns);
  const guaranteedProfit = minReturn - totalInvested;

  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-xs md:max-w-full">
        <Logo />
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Bet sem medo</h1>

      <div className="mb-6">
        <label className="mr-4">Número de Casas:</label>
        <select
          value={numBets}
          onChange={(e) => setNumBets(Number(e.target.value))}
          className="p-2 bg-[#2c3545] text-white rounded"
        >
          {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {activeBets.map((bet, index) => (
          <BettingHouse
            key={index}
            index={index}
            data={bet}
            onChange={handleChange}
            onFixStake={handleFixStake}
          />
        ))}
      </div>

      <BettingTable tableData={tableData} minReturn={minReturn} />
      <ResultsSummary guaranteedProfit={guaranteedProfit} totalInvested={totalInvested} />

      <footer className="mt-10 text-center text-sm opacity-60 flex flex-col items-center">
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
