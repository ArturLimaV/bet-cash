
import React, { useState, useEffect } from "react";
import { BettingHouse } from "@/components/BettingHouse";
import { BettingTable } from "@/components/betting/BettingTable";
import { ResultsSummary } from "@/components/betting/ResultsSummary";
import { Logo } from "@/components/Logo";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bet, TableRowData } from "@/types/betting-types";
import { calculateRealOdd } from "@/utils/betting-utils";

export default function CashbackCalculator() {
  const isMobile = useIsMobile();
  const [numBets, setNumBets] = useState(3);
  const [fixedStakeIndex, setFixedStakeIndex] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back",
    hasCommission: false,
    commission: "",
    hasFreebet: false,
    increase: "",
    stake: ""
  })));

  const handleChange = (index: number, updatedBet: Bet) => {
    const updated = [...bets];
    updated[index] = updatedBet;
    setBets(updated);
  };

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
    
    const fixedOdd = calculateRealOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    
    if (isNaN(fixedOdd) || fixedOdd <= 0 || isNaN(fixedValue) || fixedValue <= 0) return;

    const fixedReturn = fixedBet.hasFreebet
      ? (fixedOdd - 1) * fixedValue
      : fixedOdd * fixedValue;

    const updated = activeBets.map((bet, i) => {
      if (i === fixedIndex) return bet;
      
      if (bet.odd === "") return bet;

      const odd = calculateRealOdd(bet);
      if (isNaN(odd) || odd <= 1) return bet;

      let newValue = bet.hasFreebet
        ? fixedReturn / (odd - 1)
        : fixedReturn / odd;

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
  
  const freebetIndexes = activeBets
    .map((bet, index) => bet.hasFreebet ? index : -1)
    .filter(index => index !== -1);
  
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (!b.hasFreebet ? (parseFloat(b.value) || 0) : 0);
  }, 0);
  
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    
    const retorno = bet.hasFreebet 
      ? (odd - 1) * value 
      : odd * value;
    
    const lucro = retorno - totalInvested;
    
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
      layStake
    };
  });
  
  const fixedReturns = activeBets.map((bet, index) => {
    if (bet.odd === "") return 0;
    
    const odd = calculateRealOdd(bet);
    const value = parseFloat(bet.value);
    if (isNaN(odd) || !value) return 0;
    
    return bet.hasFreebet ? (odd - 1) * value : odd * value;
  });

  const minReturn = Math.min(...fixedReturns);
  const guaranteedProfit = minReturn - totalInvested;

  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{
        backgroundImage: "url('/lovable-uploads/28bd1147-f993-4695-b904-b131571e6920.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px auto",
        opacity: 0.03
      }}>
      </div>
      
      <div className="w-full max-w-xs md:max-w-full relative z-10">
        <Logo />
      </div>
      
      <h1 className="text-3xl font-bold mb-8 relative z-10">Calculadora de Cashback</h1>

      <div className="mb-6 relative z-10">
        <label className="mr-4">Número de Casas:</label>
        <select
          value={numBets}
          onChange={(e) => {
            setNumBets(Number(e.target.value));
            setFixedStakeIndex(null);
          }}
          className="p-2 bg-[#2c3545] text-white rounded"
        >
          {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 justify-center lg:flex-1">
          {activeBets.map((bet, index) => (
            <div key={index} className="flex justify-center lg:block">
              <BettingHouse
                index={index}
                data={bet}
                onChange={handleChange}
                onFixStake={handleFixStake}
                onUnfixStake={handleUnfixStake}
                isStakeFixed={fixedStakeIndex === index}
              />
            </div>
          ))}
        </div>
        
        <div className="lg:w-80 lg:flex-shrink-0">
          <ResultsSummary guaranteedProfit={guaranteedProfit} totalInvested={totalInvested} />
        </div>
      </div>

      <BettingTable 
        tableData={tableData} 
        minReturn={minReturn}
        freebetIndexes={freebetIndexes}
      />

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
