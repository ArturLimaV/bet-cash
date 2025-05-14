
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
  const totalInvested = activeBets.reduce((acc, b) => {
    // Só considerar apostas reais (não freebets) no cálculo do investimento total
    return acc + (!b.hasFreebet ? (parseFloat(b.value) || 0) : 0);
  }, 0);
  
  const tableData = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    
    // Calcular o retorno baseado em se é freebet ou não
    const retorno = bet.hasFreebet 
      ? (odd - 1) * value 
      : odd * value;
    
    // Para o cálculo do lucro, precisamos considerar apenas as apostas perdidas nas outras casas
    // e não subtrair o valor da aposta atual se for freebet
    const otherBetsValue = activeBets.reduce((acc, b, i) => {
      if (i === index) return acc; // Pular a aposta vencedora
      const betValue = parseFloat(b.value) || 0;
      return acc + (!b.hasFreebet ? betValue : 0); // Contar apenas investimentos reais
    }, 0);
    
    // Lucro é o que você recebe de volta menos o que investiu nas outras apostas
    const lucro = retorno - otherBetsValue;
    
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
  
  // Calcular os retornos para cada aposta
  const fixedReturns = activeBets.map((bet, index) => {
    const odd = calculateRealOdd(bet);
    const value = parseFloat(bet.value);
    if (!odd || !value) return 0;
    
    // Calcular retorno baseado em se é freebet ou não
    const retorno = bet.hasFreebet ? (odd - 1) * value : odd * value;
    
    // Para o lucro, subtrair apenas o valor investido nas outras apostas
    const otherBetsValue = activeBets.reduce((acc, b, i) => {
      if (i === index) return acc;
      const betValue = parseFloat(b.value) || 0;
      return acc + (!b.hasFreebet ? betValue : 0);
    }, 0);
    
    return retorno - otherBetsValue;
  });

  const minReturn = Math.min(...fixedReturns);
  const guaranteedProfit = minReturn;

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

      <div className="mt-10 w-full max-w-4xl overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Distribuição das apostas</h2>
        <table className="w-full text-left table-auto border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#1b2432]">
              <th className="px-4 py-2">Casa</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">% da Aposta</th>
              <th className="px-4 py-2">Lucro</th>
              <th className="px-4 py-2">Retorno</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data) => (
              <tr key={data.index} className="bg-[#2c3545]">
                <td className="px-4 py-2">Casa {data.index + 1}</td>
                <td className="px-4 py-2">R$ {data.value.toFixed(2)}</td>
                <td className="px-4 py-2">{data.percentage}%</td>
                <td className={`px-4 py-2 font-semibold ${data.lucroClass}`}>
                  R$ {data.lucro.toFixed(2)}
                </td>
                <td className="px-4 py-2">R$ {data.retorno.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <p className="text-lg">Retorno garantido: <span className="text-green-400 font-bold">R$ {minReturn.toFixed(2)}</span></p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Resultados</h2>
          <p>Lucro garantido: <span className={guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}>
            <strong>R$ {guaranteedProfit.toFixed(2)}</strong>
          </span></p>
          <p>ROI: <span className={guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}>
            <strong>{totalInvested > 0 ? ((guaranteedProfit / totalInvested) * 100).toFixed(2) : "0.00"}%</strong>
          </span></p>
          <p>Investimento total: <span className="text-white font-bold">R$ {totalInvested.toFixed(2)}</span></p>
        </div>
      </div>

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
