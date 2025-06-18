
import React, { useState, useEffect } from "react";
import { SurebetHouse } from "./SurebetHouse";
import { BettingTable } from "./betting/BettingTable";
import { ResultsSummary } from "./betting/ResultsSummary";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bet, TableRowData } from "@/types/betting-types";

export default function SurebetCalculator() {
  const isMobile = useIsMobile();
  const [numBets, setNumBets] = useState(4);
  const [fixedStakeIndex, setFixedStakeIndex] = useState<number | null>(null);
  
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back",
    cashback: "",
    stake: "",
    houseName: "",
    boost: "",
    commission: false,
    freebet: false
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
    
    if (fixedBet.odd === "" || fixedBet.value === "") return;
    
    const fixedOdd = parseFloat(fixedBet.odd);
    const fixedValue = parseFloat(fixedBet.value);
    
    if (isNaN(fixedOdd) || fixedOdd <= 0 || isNaN(fixedValue) || fixedValue <= 0) return;

    // Calculate what the target profit should be when the fixed bet wins
    let targetReturn = fixedValue * fixedOdd;
    
    // Apply boost if present
    if (fixedBet.boost) {
      const boostPercentage = parseFloat(fixedBet.boost) || 0;
      targetReturn = fixedValue * ((fixedOdd - 1) * (1 + boostPercentage / 100) + 1);
    }

    const updated = [...bets];
    
    activeBets.forEach((bet, i) => {
      if (i === fixedIndex) return;
      
      if (bet.odd === "") return;
      
      const odd = parseFloat(bet.odd);
      if (isNaN(odd) || odd <= 0) return;

      // Calculate required value for equal returns
      let requiredValue = targetReturn / odd;
      
      // Apply boost if present
      if (bet.boost) {
        const boostPercentage = parseFloat(bet.boost) || 0;
        const adjustedOdd = (odd - 1) * (1 + boostPercentage / 100) + 1;
        requiredValue = targetReturn / adjustedOdd;
      }

      if (requiredValue > 0) {
        updated[i] = {
          ...updated[i],
          value: requiredValue.toFixed(2),
          stake: requiredValue.toFixed(2)
        };
      }
    });

    setBets(updated);
  };

  const activeBets = bets.slice(0, numBets);
  
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (parseFloat(b.value) || 0);
  }, 0);
  
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    let odd = parseFloat(bet.odd) || 0;
    
    // Apply boost if present
    if (bet.boost) {
      const boostPercentage = parseFloat(bet.boost) || 0;
      odd = (odd - 1) * (1 + boostPercentage / 100) + 1;
    }
    
    const retorno = odd * value;
    let lucro = retorno - totalInvested;
    
    // Apply commission if enabled
    if (bet.commission) {
      lucro = lucro * 0.95; // 5% commission
    }
    
    const percentage = totalInvested > 0 ? ((value / totalInvested) * 100).toFixed(2) : "0.00";
    const lucroClass = lucro >= 0 ? "text-green-400" : "text-red-400";
    
    return {
      index,
      value,
      percentage,
      retorno,
      lucro,
      lucroClass,
      betType: bet.type,
      layStake: value,
      cashbackValue: 0,
      houseName: bet.houseName || `Casa ${index + 1}`
    };
  });
  
  const scenarios = activeBets.map((bet, index) => {
    let odd = parseFloat(bet.odd) || 0;
    const value = parseFloat(bet.value) || 0;
    
    if (bet.boost) {
      const boostPercentage = parseFloat(bet.boost) || 0;
      odd = (odd - 1) * (1 + boostPercentage / 100) + 1;
    }
    
    let winningReturn = odd * value;
    
    if (bet.commission) {
      winningReturn = winningReturn * 0.95;
    }
    
    return winningReturn;
  });

  const minReturn = Math.min(...scenarios);
  const guaranteedProfit = minReturn - totalInvested;

  return (
    <div className="min-h-screen bg-betting-bg text-white flex flex-col items-center py-8 px-4 relative overflow-hidden">
      {/* Watermark Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          return (
            <img 
              key={i}
              src="/lovable-uploads/7c3b253d-84bb-4f60-bfa3-fb9d4c4b6230.png" 
              alt="" 
              className="absolute w-32 h-32 opacity-5"
              style={{
                top: `${row * 25}%`,
                left: `${col * 25}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
      </div>

      {/* Main Logo */}
      <div className="mb-6 relative z-10">
        <img 
          src="/lovable-uploads/5e1707b4-b5b7-4fc6-8e0c-662fa09b2102.png" 
          alt="Renda Fixa" 
          className="w-32 h-32 mx-auto drop-shadow-2xl"
        />
      </div>

      <h1 className="text-3xl font-bold mb-8 relative z-10">
        <span className="text-white">Calculadora de </span>
        <span className="text-yellow-400">Surebet</span>
      </h1>

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

      {/* Betting Houses Container */}
      <div className={`w-full mb-8 relative z-10 ${
        isMobile 
          ? 'flex flex-col gap-4 items-center max-w-xs' 
          : 'flex justify-center items-start gap-8'
      }`}>
        <div className={`${
          isMobile 
            ? 'flex flex-col gap-4 w-full' 
            : 'flex gap-4 justify-center items-start'
        }`}>
          {activeBets.map((bet, index) => (
            <div key={index} className={isMobile ? 'w-full' : 'flex-shrink-0'}>
              <SurebetHouse
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

        {/* Results Panel - Desktop only */}
        {!isMobile && (
          <div className="bg-betting-card p-6 rounded-lg border border-gray-700 min-w-[280px]">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">Resultados</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-300">Lucro garantido:</span>
                <div className={`text-lg font-bold ${guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  R$ {guaranteedProfit.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-gray-300">ROI:</span>
                <div className={`text-lg font-bold ${guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalInvested > 0 ? ((guaranteedProfit / totalInvested) * 100).toFixed(2) : "0.00"}%
                </div>
              </div>
              <div>
                <span className="text-gray-300">Investimento total:</span>
                <div className="text-lg font-bold text-white">
                  R$ {totalInvested.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BettingTable 
        tableData={tableData} 
        minReturn={minReturn}
        freebetIndexes={activeBets.map((bet, index) => bet.freebet ? index : -1).filter(i => i >= 0)}
      />
      <ResultsSummary guaranteedProfit={guaranteedProfit} totalInvested={totalInvested} />

      {/* Social Media Icons */}
      <div className="mt-12 flex gap-6 relative z-10">
        <a 
          href="https://t.me/rendafixaa_zerorisco" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
        >
          <MessageCircle size={24} className="text-white" />
        </a>
        <a 
          href="https://www.instagram.com/renda_fixa_zerored?igsh=bXBnbTZidXdoamky&utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
        >
          <Instagram size={24} className="text-white" />
        </a>
      </div>
    </div>
  );
}
