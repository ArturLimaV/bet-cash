
import React, { useState, useEffect } from "react";
import { Bet } from "@/types/betting-types";
import { Check } from "lucide-react";
import { calculateRealOdd, calculateStake } from "@/utils/betting-utils";

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
  // Track if values have been changed since fixing
  const [valuesChangedSinceFixing, setValuesChangedSinceFixing] = useState(false);
  
  // Reset the tracking state when the bet is fixed or unfixed
  useEffect(() => {
    if (isStakeFixed) {
      setValuesChangedSinceFixing(false);
    }
  }, [isStakeFixed]);
  
  // Calculando a odd real baseada nos valores atuais
  const calculateDisplayOdd = () => {
    let rawOdd = parseFloat(data.odd);
    if (isNaN(rawOdd) || rawOdd <= 0) return "Aguardando...";
    
    let baseOdd = data.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

    return baseOdd.toFixed(3);
  };

  const realOdd = calculateDisplayOdd();
  
  // Modified auto-unfixing logic - only unfix when values change after the bet has been fixed
  useEffect(() => {
    // Only apply when already fixed and values have changed since fixing
    if (data.type === 'Lay' && isStakeFixed && valuesChangedSinceFixing && onUnfixStake) {
      onUnfixStake(index);
      setValuesChangedSinceFixing(false); // Reset after unfixing
    }
  }, [data.odd, data.value, data.stake, data.type, isStakeFixed, valuesChangedSinceFixing]);
  
  // Calculate stake or value based on changes to the other field
  useEffect(() => {
    // Skip if odd is invalid
    const oddValue = parseFloat(data.odd);
    if (isNaN(oddValue) || oddValue <= 1) return;
    
    // Skip calculation if both fields are empty or if no field was edited yet
    if ((!data.value && !data.stake) || !data.lastEditedField) return;
    
    // Only perform auto-calculations for Lay bets
    if (data.type === 'Lay') {
      // Calculate based on which field was last edited
      if (data.lastEditedField === 'value') {
        // When value is changed, calculate stake
        const valueNum = parseFloat(data.value);
        if (!isNaN(valueNum) && valueNum > 0) {
          const stakeAmount = valueNum / (oddValue - 1);
          onChange(index, { ...data, stake: stakeAmount.toFixed(2), lastEditedField: 'value' });
        }
      } else if (data.lastEditedField === 'stake') {
        // When stake is changed, calculate value
        const stakeNum = parseFloat(data.stake);
        if (!isNaN(stakeNum) && stakeNum > 0) {
          const valueAmount = stakeNum * (oddValue - 1);
          onChange(index, { ...data, value: valueAmount.toFixed(2), lastEditedField: 'stake' });
        }
      }
    } else {
      // For Back bets, stake = value
      if (data.lastEditedField === 'value') {
        onChange(index, { ...data, stake: data.value, lastEditedField: 'value' });
      } else if (data.lastEditedField === 'stake') {
        onChange(index, { ...data, value: data.stake, lastEditedField: 'stake' });
      }
    }
  }, [data.value, data.stake, data.odd, data.type, data.lastEditedField]);

  // Handlers that track changes after fixing
  const handleOddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStakeFixed) {
      setValuesChangedSinceFixing(true);
    }
    onChange(index, { ...data, odd: e.target.value });
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStakeFixed) {
      setValuesChangedSinceFixing(true);
    }
    onChange(index, { 
      ...data, 
      value: e.target.value,
      lastEditedField: 'value'
    });
  };
  
  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isStakeFixed) {
      setValuesChangedSinceFixing(true);
    }
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

      <label className="block mt-4 mb-2">Tipo</label>
      <select
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.type}
        onChange={(e) => {
          if (isStakeFixed) {
            setValuesChangedSinceFixing(true);
          }
          onChange(index, { ...data, type: e.target.value });
        }}
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

      <label className="block mb-2">Cashback (%)</label>
      <input
        type="number"
        step="0.1"
        min="0"
        max="100"
        placeholder="Ex: 10"
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.cashback || ""}
        onChange={(e) => {
          if (isStakeFixed) {
            setValuesChangedSinceFixing(true);
          }
          onChange(index, { ...data, cashback: e.target.value });
        }}
      />

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
