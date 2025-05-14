
import React, { useState } from "react";
import { BettingHouse } from "./BettingHouse";
import { Logo } from "./Logo";
import { Instagram, Telegram } from "lucide-react";

interface Bet {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
}

interface Result {
  index: number;
  retorno: string;
  lucro: string;
}

export default function SurebetCalculator() {
  const [numBets, setNumBets] = useState(3);
  const [bets, setBets] = useState<Bet[]>(Array(5).fill(null).map(() => ({
    odd: "2.00",
    value: "",
    type: "Back",
    hasCommission: false,
    commission: "",
    hasFreebet: false
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

  const results: Result[] = bets.slice(0, numBets).map((bet, index) => {
    const odd = calculateRealOdd(bet);
    const value = parseFloat(bet.value);
    if (!odd || !value) return { index, retorno: "0", lucro: "0" };

    const retorno = bet.hasFreebet
      ? (odd - 1) * value
      : odd * value;

    const totalApostado = bets.slice(0, numBets).reduce((acc, b) => acc + (parseFloat(b.value) || 0), 0);
    const lucro = retorno - totalApostado;
    return { 
      index, 
      retorno: retorno.toFixed(2), 
      lucro: lucro.toFixed(2) 
    };
  });

  return (
    <div className="min-h-screen bg-betting-bg text-white flex flex-col items-center py-8 px-4">
      <Logo />
      
      <h1 className="text-3xl font-bold mb-8">Bet sem medo</h1>

      <div className="mb-6">
        <label className="mr-4">Número de Casas:</label>
        <select
          value={numBets}
          onChange={(e) => setNumBets(Number(e.target.value))}
          className="p-2 bg-betting-input text-white rounded"
        >
          {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
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

      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4 text-center">Resultados</h2>
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-betting-card">
              <th className="px-4 py-2">Casa</th>
              <th className="px-4 py-2">Retorno</th>
              <th className="px-4 py-2">Lucro/Prejuízo</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="bg-betting-input">
                <td className="px-4 py-2">Casa {r.index + 1}</td>
                <td className="px-4 py-2">R$ {r.retorno}</td>
                <td className="px-4 py-2">R$ {r.lucro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-10 text-center text-sm opacity-60 flex flex-col items-center">
        <p className="mb-2">Nos siga no Instagram e Telegram</p>
        <div className="flex space-x-4">
          <a href="https://t.me/betsemmedo" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            <Telegram size={24} />
          </a>
          <a href="https://www.instagram.com/betsemmedo?igsh=MW1rcjM0Z3I2aTVsNw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
            <Instagram size={24} />
          </a>
        </div>
      </footer>
    </div>
  );
}
