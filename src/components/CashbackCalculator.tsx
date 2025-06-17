
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CashbackBet {
  houseName: string;
  odd: string;
  value: string;
  cashback: string;
  isStakeFixed: boolean;
}

export function CashbackCalculator() {
  const [numBets, setNumBets] = useState(3);
  const [bets, setBets] = useState<CashbackBet[]>(
    Array(5).fill(null).map(() => ({
      houseName: "",
      odd: "2.00",
      value: "",
      cashback: "10",
      isStakeFixed: false
    }))
  );

  const handleBetChange = (index: number, field: keyof CashbackBet, value: string | boolean) => {
    const updated = [...bets];
    updated[index] = { ...updated[index], [field]: value };
    setBets(updated);
  };

  const handleFixStake = (index: number) => {
    const updated = [...bets];
    updated[index].isStakeFixed = !updated[index].isStakeFixed;
    setBets(updated);
  };

  const calculateOddReal = (bet: CashbackBet) => {
    const odd = parseFloat(bet.odd);
    const cashback = parseFloat(bet.cashback);
    
    if (isNaN(odd) || isNaN(cashback)) return "2.000";
    
    // Aplica o cashback na odd
    const oddReal = odd + (odd - 1) * (cashback / 100);
    return oddReal.toFixed(3);
  };

  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Calculadora de Cashback</h1>

      <div className="mb-6">
        <label className="mr-4 text-white">Número de Casas:</label>
        <Select value={numBets.toString()} onValueChange={(value) => setNumBets(Number(value))}>
          <SelectTrigger className="w-20 bg-[#2c3545] text-white border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#2c3545] text-white border-gray-600">
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {bets.slice(0, numBets).map((bet, index) => (
          <Card key={index} className="bg-[#1b2432] border-gray-700 w-full max-w-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-center">
                <Input
                  placeholder={`Casa ${index + 1}`}
                  value={bet.houseName}
                  onChange={(e) => handleBetChange(index, 'houseName', e.target.value)}
                  className="bg-[#2c3545] text-white border-gray-600 text-center font-bold"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Odd</label>
                <Input
                  type="number"
                  step="0.01"
                  value={bet.odd}
                  onChange={(e) => handleBetChange(index, 'odd', e.target.value)}
                  className="bg-[#2c3545] text-white border-gray-600"
                />
                <p className="text-yellow-400 text-xs mt-1">
                  Odd real: {calculateOddReal(bet)}
                </p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Valor</label>
                <Input
                  type="number"
                  step="0.01"
                  value={bet.value}
                  onChange={(e) => handleBetChange(index, 'value', e.target.value)}
                  className="bg-[#2c3545] text-white border-gray-600"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Cashback (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 10"
                  value={bet.cashback}
                  onChange={(e) => handleBetChange(index, 'cashback', e.target.value)}
                  className="bg-[#2c3545] text-white border-gray-600"
                />
              </div>

              <Button
                onClick={() => handleFixStake(index)}
                className={`w-full ${
                  bet.isStakeFixed 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white`}
                disabled={!bet.value || parseFloat(bet.value) <= 0}
              >
                {bet.isStakeFixed ? "Stake Fixada" : "Fixar Stake"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
