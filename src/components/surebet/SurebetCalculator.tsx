
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

interface Bet {
  odd: string;
  value: string;
  type: string;
  cashback: string;
  stake: string;
  lastEditedField?: 'value' | 'stake';
  houseName?: string;
}

interface TableRowData {
  index: number;
  value: number;
  percentage: string;
  retorno: number;
  lucro: number;
  lucroClass: string;
  betType?: string;
  layStake?: number;
  cashbackValue?: number;
  houseName?: string;
}

export function SurebetCalculator() {
  const [bets, setBets] = useState<Bet[]>([
    { odd: "", value: "", type: "Back", cashback: "0", stake: "", houseName: "" },
    { odd: "", value: "", type: "Back", cashback: "0", stake: "", houseName: "" }
  ]);
  
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [minReturn, setMinReturn] = useState<number>(0);
  const [maxReturn, setMaxReturn] = useState<number>(0);
  const [minProfit, setMinProfit] = useState<number>(0);
  const [maxProfit, setMaxProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);

  const addBet = () => {
    setBets([...bets, { odd: "", value: "", type: "Back", cashback: "0", stake: "", houseName: "" }]);
  };

  const removeBet = (index: number) => {
    if (bets.length > 2) {
      const newBets = bets.filter((_, i) => i !== index);
      setBets(newBets);
    }
  };

  const updateBet = (index: number, field: keyof Bet, value: string) => {
    const newBets = [...bets];
    newBets[index] = { ...newBets[index], [field]: value };
    
    if (field === 'value' || field === 'stake') {
      newBets[index].lastEditedField = field;
    }
    
    setBets(newBets);
  };

  const calculateRealOdd = (bet: Bet): number => {
    if (bet.odd === "") return NaN;
    
    let rawOdd = parseFloat(bet.odd);
    if (isNaN(rawOdd) || rawOdd <= 0) return NaN;
    
    let baseOdd = bet.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;
    return baseOdd;
  };

  const calculateEffectiveOdd = (bet: Bet): number => {
    const baseOdd = calculateRealOdd(bet);
    if (isNaN(baseOdd)) return NaN;
    
    const cashbackPercentage = parseFloat(bet.cashback) || 0;
    if (cashbackPercentage === 0) return baseOdd;
    
    const cashbackDecimal = cashbackPercentage / 100;
    const effectiveOdd = baseOdd / (1 - cashbackDecimal);
    
    return effectiveOdd;
  };

  const calculateStake = (bet: Bet): number => {
    if (!bet.value || bet.value === "") return 0;
    
    const value = parseFloat(bet.value);
    if (isNaN(value)) return 0;
    
    if (bet.type === "Lay") {
      const rawOdd = parseFloat(bet.odd);
      if (isNaN(rawOdd) || rawOdd <= 1) return 0;
      return value / (rawOdd - 1);
    }
    
    return value;
  };

  const calculateCashback = (bet: Bet): number => {
    if (!bet.cashback || bet.cashback === "" || !bet.value || bet.value === "") return 0;
    
    const cashbackPercentage = parseFloat(bet.cashback);
    const betValue = parseFloat(bet.value);
    
    if (isNaN(cashbackPercentage) || isNaN(betValue)) return 0;
    
    return (betValue * cashbackPercentage) / 100;
  };

  const calculate = () => {
    if (!investmentAmount || investmentAmount === "") return;

    const investment = parseFloat(investmentAmount);
    if (isNaN(investment) || investment <= 0) return;

    const validBets = bets.filter(bet => {
      const odd = calculateRealOdd(bet);
      return !isNaN(odd) && odd > 0;
    });

    if (validBets.length < 2) return;

    const effectiveOdds = validBets.map(bet => calculateEffectiveOdd(bet));
    const totalInverseOdds = effectiveOdds.reduce((sum, odd) => sum + (1 / odd), 0);

    const newTableData: TableRowData[] = validBets.map((bet, index) => {
      const effectiveOdd = effectiveOdds[index];
      const percentage = (1 / effectiveOdd) / totalInverseOdds;
      const value = investment * percentage;
      const retorno = value * effectiveOdd;
      const lucro = retorno - investment;
      const cashbackValue = calculateCashback(bet);
      const layStake = bet.type === "Lay" ? calculateStake(bet) : undefined;

      return {
        index,
        value,
        percentage: (percentage * 100).toFixed(2),
        retorno,
        lucro,
        lucroClass: lucro >= 0 ? "text-green-400" : "text-red-400",
        betType: bet.type,
        layStake,
        cashbackValue,
        houseName: bet.houseName || `Casa ${index + 1}`
      };
    });

    setTableData(newTableData);
    setTotalInvestment(investment);

    const returns = newTableData.map(row => row.retorno);
    const profits = newTableData.map(row => row.lucro);

    setMinReturn(Math.min(...returns));
    setMaxReturn(Math.max(...returns));
    setMinProfit(Math.min(...profits));
    setMaxProfit(Math.max(...profits));

    const margin = ((Math.min(...returns) / investment) - 1) * 100;
    setProfitMargin(margin);
  };

  useEffect(() => {
    if (investmentAmount) {
      calculate();
    }
  }, [bets, investmentAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] to-[#1a2332] p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-[#1b2432] border-gray-600">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">
              Calculadora de Surebet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="investment" className="text-gray-300">
                Valor Total do Investimento (R$)
              </Label>
              <Input
                id="investment"
                type="number"
                placeholder="1000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Bets */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Apostas</h3>
                <Button onClick={addBet} className="bg-blue-600 hover:bg-blue-700">
                  Adicionar Aposta
                </Button>
              </div>

              {bets.map((bet, index) => (
                <Card key={index} className="bg-gray-800 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-white font-medium">Aposta {index + 1}</h4>
                      {bets.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBet(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Casa de Aposta</Label>
                        <Input
                          placeholder="Ex: Bet365"
                          value={bet.houseName || ""}
                          onChange={(e) => updateBet(index, 'houseName', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Odd</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="2.50"
                          value={bet.odd}
                          onChange={(e) => updateBet(index, 'odd', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Tipo</Label>
                        <Select value={bet.type} onValueChange={(value) => updateBet(index, 'type', value)}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Back">Back</SelectItem>
                            <SelectItem value="Lay">Lay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Valor (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="500"
                          value={bet.value}
                          onChange={(e) => updateBet(index, 'value', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Cashback (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0"
                          value={bet.cashback}
                          onChange={(e) => updateBet(index, 'cashback', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>

                      {bet.type === "Lay" && (
                        <div className="space-y-2">
                          <Label className="text-gray-300">Stake Lay</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={calculateStake(bet).toFixed(2)}
                            readOnly
                            className="bg-gray-600 border-gray-500 text-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Results */}
            {tableData.length > 0 && (
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Distribuição de Apostas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-gray-300">Casa</TableHead>
                          <TableHead className="text-gray-300">Valor</TableHead>
                          <TableHead className="text-gray-300">%</TableHead>
                          <TableHead className="text-gray-300">Retorno</TableHead>
                          <TableHead className="text-gray-300">Lucro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.map((row) => (
                          <TableRow key={row.index} className="border-gray-600">
                            <TableCell className="text-white">{row.houseName}</TableCell>
                            <TableCell className="text-white">R$ {row.value.toFixed(2)}</TableCell>
                            <TableCell className="text-white">{row.percentage}%</TableCell>
                            <TableCell className="text-white">R$ {row.retorno.toFixed(2)}</TableCell>
                            <TableCell className={row.lucroClass}>R$ {row.lucro.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">Resumo dos Resultados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-gray-400">Investimento Total</p>
                        <p className="text-2xl font-bold text-white">R$ {totalInvestment.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Retorno Mínimo</p>
                        <p className="text-2xl font-bold text-green-400">R$ {minReturn.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Lucro Mínimo</p>
                        <p className={`text-2xl font-bold ${minProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          R$ {minProfit.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Margem de Lucro</p>
                        <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profitMargin.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
