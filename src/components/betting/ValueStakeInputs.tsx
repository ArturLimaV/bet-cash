
import React from "react";
import { Bet } from "@/types/betting-types";

interface ValueStakeInputsProps {
  data: Bet;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStakeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ValueStakeInputs({ data, onValueChange, onStakeChange }: ValueStakeInputsProps) {
  return (
    <>
      <label className="block mb-2">Valor</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.value}
        onChange={onValueChange}
      />
      
      {data.type === "Lay" && (
        <>
          <label className="block mb-2">Stake</label>
          <input
            type="number"
            step="0.01"
            className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
            value={data.stake || ""}
            onChange={onStakeChange}
          />
        </>
      )}
    </>
  );
}
