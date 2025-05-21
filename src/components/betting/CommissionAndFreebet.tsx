
import React from "react";
import { Bet } from "@/types/betting-types";

interface CommissionAndFreebetProps {
  data: Bet;
  onCommissionToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCommissionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFreebetToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CommissionAndFreebet({ 
  data, 
  onCommissionToggle, 
  onCommissionChange, 
  onFreebetToggle 
}: CommissionAndFreebetProps) {
  return (
    <>
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={data.hasCommission}
            onChange={onCommissionToggle}
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
            onChange={onCommissionChange}
          />
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={data.hasFreebet}
            onChange={onFreebetToggle}
          />
          Freebet
        </label>
      </div>
    </>
  );
}
