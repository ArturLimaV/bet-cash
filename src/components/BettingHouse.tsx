import React, { useState, useEffect } from "react";
import { Bet } from "@/types/betting-types";
import { Check } from "lucide-react";
import { calculateRealOdd, calculateStake, calculateValueFromStake } from "@/utils/betting-utils";

interface BettingHouseProps {
  index: number;
  data: Bet;
  onChange: (index: number, data: Bet) => void;
  onFixStake: (index: number) => void;
  onUnfixStake?: (index: number) => void;
  isStakeFixed?: boolean;
}

export function BettingHouse({ 
  index, 
  data, 
  onChange, 
  onFixStake,
  onUnfixStake,
  isStakeFixed = false
}: BettingHouseProps) {
  // Calculando a odd real baseada nos valores atuais
  const calculateDisplayOdd = () => {
    let rawOdd = parseFloat(data.odd);
    if (isNaN(rawOdd) || rawOdd <= 0) return "Aguardando...";
    
    let baseOdd = data.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

    // Apply commission if present
    if (data.hasCommission && data.commission !== "") {
      const commissionValue = parseFloat(data.commission);
      if (!isNaN(commissionValue)) {
        baseOdd = 1 + ((baseOdd - 1) * (1 - commissionValue / 100));
      }
    }
    
    // Apply increase if present
    const aumentoValue = parseFloat(data.increase);
    let oddReal = baseOdd;
    if (!isNaN(aumentoValue) && aumentoValue > 0) {
      oddReal = ((baseOdd - 1) * (1 + aumentoValue / 100)) + 1;
    }

    return oddReal.toFixed(3);
  };

  const realOdd = calculateDisplayOdd();
  
  // Calculate value or stake based on the other field for Lay bets
  useEffect(() => {
    if (data.type !== 'Lay') return;
    
    const realOddValue = parseFloat(realOdd);
    if (isNaN(realOddValue) || realOddValue <= 1) return;
    
    // Skip calculation if both fields are empty or if no field was edited yet
    if ((!data.value && !data.stake) || !data.lastEditedField) return;
    
    // Calculate based on which field was last edited
    if (data.lastEditedField === 'value') {
      const valueNum = parseFloat(data.value);
      if (!isNaN(valueNum) && valueNum > 0) {
        // Calculate stake based on value
        const stakeValue = calculateStake(valueNum, realOddValue);
        onChange(index, { ...data, stake: stakeValue.toFixed(2) });
      }
    } else if (data.lastEditedField === 'stake') {
      const stakeNum = parseFloat(data.stake);
      if (!isNaN(stakeNum) && stakeNum > 0) {
        // Calculate value based on stake
        const valueAmount = calculateValueFromStake(stakeNum, realOddValue);
        onChange(index, { ...data, value: valueAmount.toFixed(2) });
      }
    }
  }, [data.value, data.stake, data.odd, realOdd, data.type, data.lastEditedField, data.increase, data.commission, data.hasCommission]);

  const handleOddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOddValue = e.target.value;
    onChange(index, { ...data, odd: newOddValue });
    
    // If the odd field is cleared and this house has fixed stake, unfix it
    if (newOddValue === "" && isStakeFixed && onUnfixStake) {
      onUnfixStake(index);
    }
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { 
      ...data, 
      value: e.target.value,
      lastEditedField: 'value'
    });
  };
  
  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, {
      ...data,
      stake: e.target.value,
      lastEditedField: 'stake'
    });
  };

  return (
    <div className="bg-[#1b2432] text-white p-6 rounded-lg w-full max-w-xs border border-gray-700">
      <div className="text-center text-xl font-bold mb-4">Casa {index + 1}</div>

      <label className="block mb-2">Odd</label>
      <input
        type="text"
        className="w-full p-2 rounded bg-[#2c3545] text-white"
        value={data.odd}
        onChange={handleOddChange}
      />
      <p className="text-yellow-400 text-xs mt-1">
        Odd real: {realOdd}
      </p>

      <label className="block mt-4 mb-2">Aumento (%)</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-2 rounded bg-[#2c3545] text-white"
        placeholder="Digite o aumento %"
        value={data.increase || ""}
        onChange={(e) => onChange(index, { ...data, increase: e.target.value })}
      />

      <label className="block mt-4 mb-2">Tipo</label>
      <select
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.type}
        onChange={(e) => onChange(index, { ...data, type: e.target.value })}
      >
        <option value="Back">Back</option>
        <option value="Lay">Lay</option>
      </select>

      <label className="block mb-2">Valor</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.value}
        onChange={handleValueChange}
      />
      
      {/* Exibe o campo Stake somente quando o tipo for Lay */}
      {data.type === "Lay" && (
        <>
          <label className="block mb-2">Stake</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
            value={data.stake || ""}
            onChange={handleStakeChange}
          />
        </>
      )}

      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={data.hasCommission}
            onChange={(e) => onChange(index, { ...data, hasCommission: e.target.checked })}
          />
          Comissão
        </label>
        {data.hasCommission && (
          <input
            type="number"
            step="0.1"
            placeholder="%"
            className="w-full mt-1 p-2 rounded bg-[#2c3545] text-white text-sm"
            value={data.commission || ""}
            onChange={(e) => onChange(index, { ...data, commission: e.target.value })}
          />
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={data.hasFreebet}
            onChange={(e) => onChange(index, { ...data, hasFreebet: e.target.checked })}
          />
          Freebet
        </label>
      </div>

      <button
        className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded disabled:opacity-50 transition-colors ${
          isStakeFixed 
            ? "bg-betting-green text-white" 
            : "bg-gray-600 text-white"
        }`}
        onClick={() => onFixStake(index)}
        disabled={!(parseFloat(data.value) > 0)}
      >
        {isStakeFixed && <Check size={16} />}
        {isStakeFixed ? "Stake Fixada" : "Fixar Stake"}
      </button>
    </div>
  );
}
