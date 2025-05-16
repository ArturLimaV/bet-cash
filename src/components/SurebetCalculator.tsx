import React, { useState, useEffect } from "react";
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
  const [fixedStakeIndex, setFixedStakeIndex] = useState<number | null>(null);
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back",
    hasCommission: false,
    commission: "",
    hasFreebet: false,
    increase: ""
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

  // Função separada para distribuir stakes com base na stake fixada
  const distributeStakes = (fixedIndex: number) => {
    const activeBets = bets.slice(0, numBets);
    const fixedBet = activeBets[fixedIndex];
    
    // Permitir campo vazio temporariamente - não calcular nada nesse caso
    if (fixedBet.odd === "") return;
    
    const fixedOdd = calculateRealOdd(fixedBet);
    const fixedValue = parseFloat(fixedBet.value);
    
    // Se não conseguir obter odd válido ou valor fixado, não faz nada
    // Isso permite que o usuário digite livremente no campo de odd
    if (isNaN(fixedOdd) || fixedOdd <= 0 || isNaN(fixedValue) || fixedValue <= 0) return;

    const fixedReturn = fixedBet.hasFreebet
      ? (fixedOdd - 1) * fixedValue
      : fixedOdd * fixedValue;

    const updated = activeBets.map((bet, i) => {
      // Não alterar a stake da aposta fixada
      if (i === fixedIndex) return bet;
      
      // Verificar se o campo de odd está vazio e não calcular nada nesse caso
      if (bet.odd === "") return bet;

      const odd = calculateRealOdd(bet);
      // Se o odd não for válido, não tenta calcular (permite edição livre)
      if (isNaN(odd) || odd <= 1) return bet;

      const newValue = bet.hasFreebet
        ? fixedReturn / (odd - 1)
        : fixedReturn / odd;

      return {
        ...bet,
        value: newValue.toFixed(2)
      };
    });

    // Atualizar apenas os valores das stakes, preservando todos os outros campos
    const newBets = [...bets];
    updated.forEach((bet, i) => {
      if (i !== fixedIndex) {
        newBets[i] = {
          ...newBets[i],
          value: bet.value
        };
      }
    });

    setBets(newBets);
  };

  const activeBets = bets.slice(0, numBets);
  
  // Collect freebet indexes for visual indication
  const freebetIndexes = activeBets
    .map((bet, index) => bet.hasFreebet ? index : -1)
    .filter(index => index !== -1);
  
  // Calculate total invested amount (excluding freebets)
  const totalInvested = activeBets.reduce((acc, b) => {
    return acc + (!b.hasFreebet ? (parseFloat(b.value) || 0) : 0);
  }, 0);
  
  // Calculate table data for each bet outcome
  const tableData: TableRowData[] = activeBets.map((bet, index) => {
    const value = parseFloat(bet.value) || 0;
    const odd = calculateRealOdd(bet);
    
    // Verifica se a odd é NaN (campo vazio ou inválido)
    if (isNaN(odd)) {
      return {
        index,
        value,
        percentage: "N/A",
        retorno: NaN,
        lucro: NaN,
        lucroClass: "text-gray-400"
      };
    }
    
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
    // Ignorar cálculos para campos de odd vazios
    if (bet.odd === "") return NaN;
    
    const odd = calculateRealOdd(bet);
    const value = parseFloat(bet.value);
    if (isNaN(odd) || !value) return NaN;
    
    // Calculate return based on whether it's a freebet or not
    return bet.hasFreebet ? (odd - 1) * value : odd * value;
  });

  // Filtra os valores NaN antes de calcular o mínimo
  const validReturns = fixedReturns.filter(val => !isNaN(val));
  const minReturn = validReturns.length > 0 ? Math.min(...validReturns) : NaN;
  const guaranteedProfit = !isNaN(minReturn) ? minReturn - totalInvested : NaN;

  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4 relative">
      {/* Nova marca d'água com a imagem repetida */}
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
      
      <h1 className="text-3xl font-bold mb-8 relative z-10">Bet sem medo</h1>

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
            isStakeFixed={fixedStakeIndex === index}
          />
        ))}
      </div>

      <BettingTable 
        tableData={tableData} 
        minReturn={minReturn}
        freebetIndexes={freebetIndexes}
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
