
import React, { useState } from "react";
import { BettingHouse } from "./BettingHouse";
import { Logo } from "./Logo";
import { Instagram, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Bet {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
  stakeIncrease: string;
}

interface Result {
  index: number;
  retorno: string;
  lucro: string;
}

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
    stakeIncrease: ""
  })));

  const handleChange = (index: number, updatedBet: Bet) => {
    const updated = [...bets];
    updated[index] = updatedBet;
    setBets(updated);
  };

  const calculateRealOdd = (bet: Bet) => {
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

  const handleFixStake = (fixedIndex: number) => {
    const activeBets = bets.slice(0, numBets);
    const fixedBet = activeBets[fixedIndex];
    const fixedOdd = calculateRealOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    if (!fixedOdd || !fixedValue || fixedValue < 0) return;

    // Calculate return based on whether it's a freebet or not
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

  const results: Result[] = bets.slice(0, numBets).map((bet, index) => {
    const odd = calculateRealOdd(bet);
    const value = parseFloat(bet.value);
    if (!odd || !value) return { index, retorno: "0", lucro: "0" };

    // Calculate return based on whether it's a freebet or not
    const retorno = bet.hasFreebet
      ? (odd - 1) * value
      : odd * value;

    // Calculate total invested, excluding freebets
    const totalInvested = bets.slice(0, numBets).reduce((acc, b) => {
      // Only add to invested amount if it's not a freebet
      const betValue = parseFloat(b.value) || 0;
      return acc + (!b.hasFreebet ? betValue : 0);
    }, 0);
    
    // For the lucro calculation, we need to account for all bets that would be lost
    // if this particular bet wins. We exclude the current bet's stake from the total invested.
    const otherBetsValue = bets.slice(0, numBets).reduce((acc, b, i) => {
      if (i === index) return acc; // Skip the winning bet
      const betValue = parseFloat(b.value) || 0;
      return acc + (!b.hasFreebet ? betValue : 0); // Only count real money investments
    }, 0);

    // Lucro is what you get back minus what you invested in other bets
    const lucro = retorno - otherBetsValue;
    
    return { 
      index, 
      retorno: retorno.toFixed(2), 
      lucro: lucro.toFixed(2) 
    };
  });

  // Calculate total invested excluding freebets for the summary section
  const totalInvested = bets.slice(0, numBets).reduce((acc, b) => {
    const betValue = parseFloat(b.value) || 0;
    return acc + (!b.hasFreebet ? betValue : 0);
  }, 0);

  // Find the minimum return from all bets for the guaranteed profit calculation
  const minReturnBet = results.reduce((min, result) => {
    const lucro = parseFloat(result.lucro);
    return lucro < parseFloat(min.lucro) ? result : min;
  }, { index: -1, retorno: "Infinity", lucro: "Infinity" });

  const guaranteedProfit = parseFloat(minReturnBet.lucro);

  return (
    <div className="min-h-screen bg-betting-bg text-white flex flex-col items-center py-4 md:py-8 px-2 md:px-4">
      <div className="w-full max-w-xs md:max-w-full">
        <Logo />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Bet sem medo</h1>

      <div className="mb-4 md:mb-6 w-full flex justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <label className="text-sm md:text-base">Número de Casas:</label>
          <select
            value={numBets}
            onChange={(e) => setNumBets(Number(e.target.value))}
            className="p-2 bg-betting-input text-white rounded text-sm md:text-base w-32"
          >
            {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center w-full max-w-6xl">
        {bets.slice(0, numBets).map((bet, index) => (
          <BettingHouse
            key={index}
            index={index}
            data={bet}
            onChange={handleChange}
            onFixStake={handleFixStake}
          />
        ))}
      </div>

      <div className="mt-6 md:mt-10 w-full max-w-full overflow-x-auto px-2">
        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-center">Resultados</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse min-w-[300px]">
            <thead>
              <tr className="bg-betting-card">
                <th className="px-2 md:px-4 py-2 text-sm md:text-base">Casa</th>
                <th className="px-2 md:px-4 py-2 text-sm md:text-base">Retorno</th>
                <th className="px-2 md:px-4 py-2 text-sm md:text-base">Lucro/Prejuízo</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="bg-betting-input">
                  <td className="px-2 md:px-4 py-2 text-sm md:text-base">Casa {r.index + 1}</td>
                  <td className="px-2 md:px-4 py-2 text-sm md:text-base">R$ {r.retorno}</td>
                  <td className="px-2 md:px-4 py-2 text-sm md:text-base">R$ {r.lucro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary section */}
      <div className="mt-6 w-full max-w-full px-2">
        <div className="bg-betting-card p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-center">Resumo</h3>
          <p className="flex justify-between">
            <span>Investimento total:</span> 
            <span className="font-bold">R$ {totalInvested.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Lucro garantido:</span> 
            <span className={`font-bold ${guaranteedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {guaranteedProfit.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>ROI:</span> 
            <span className={`font-bold ${guaranteedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalInvested > 0 ? ((guaranteedProfit / totalInvested) * 100).toFixed(2) : "0.00"}%
            </span>
          </p>
        </div>
      </div>

      <footer className="mt-6 md:mt-10 text-center text-xs md:text-sm opacity-60 flex flex-col items-center">
        <p className="mb-2">Nos siga no Instagram e Telegram</p>
        <div className="flex space-x-4">
          <a href="https://t.me/betsemmedo" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
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
