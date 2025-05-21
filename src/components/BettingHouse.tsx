
import React from "react";
import { Bet } from "@/types/betting-types";
import { OddSection } from "./betting/OddSection";
import { BetTypeSelector } from "./betting/BetTypeSelector";
import { ValueStakeInputs } from "./betting/ValueStakeInputs";
import { CommissionAndFreebet } from "./betting/CommissionAndFreebet";
import { FixStakeButton } from "./betting/FixStakeButton";
import { useBetCalculations } from "@/hooks/useBetCalculations";
import { useStakeCalculation } from "@/hooks/useStakeCalculation";

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
  const { realOdd, handleValueChange: markValueChanged } = useBetCalculations(data, isStakeFixed, onUnfixStake, index);
  
  // Use the stake calculation hook
  useStakeCalculation(data, onChange, index);
  
  // Event handlers
  const handleOddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, { ...data, odd: e.target.value });
  };
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, { 
      ...data, 
      value: e.target.value,
      lastEditedField: 'value'
    });
  };
  
  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, {
      ...data,
      stake: e.target.value,
      lastEditedField: 'stake'
    });
  };
  
  const handleIncreaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, { ...data, increase: e.target.value });
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    markValueChanged();
    onChange(index, { ...data, type: e.target.value });
  };
  
  const handleCommissionToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, { ...data, hasCommission: e.target.checked });
  };
  
  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, { ...data, commission: e.target.value });
  };
  
  const handleFreebetToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    markValueChanged();
    onChange(index, { ...data, hasFreebet: e.target.checked });
  };
  
  const handleFixStake = () => onFixStake(index);

  return (
    <div className="bg-[#1b2432] text-white p-6 rounded-lg w-full max-w-xs border border-gray-700">
      <div className="text-center text-xl font-bold mb-4">Casa {index + 1}</div>

      <OddSection 
        data={data} 
        realOdd={realOdd}
        onOddChange={handleOddChange}
        onIncreaseChange={handleIncreaseChange}
      />

      <BetTypeSelector 
        data={data} 
        onChange={handleTypeChange}
      />

      <ValueStakeInputs
        data={data}
        onValueChange={handleValueChange}
        onStakeChange={handleStakeChange}
      />
      
      <CommissionAndFreebet
        data={data}
        onCommissionToggle={handleCommissionToggle}
        onCommissionChange={handleCommissionChange}
        onFreebetToggle={handleFreebetToggle}
      />

      <FixStakeButton
        isFixed={isStakeFixed}
        onFix={handleFixStake}
        disabled={!(parseFloat(data.value) > 0)}
      />
    </div>
  );
}
