
import React from "react";
import { Bet } from "@/types/betting-types";

interface OddSectionProps {
  data: Bet;
  realOdd: string;
  onOddChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIncreaseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function OddSection({ data, realOdd, onOddChange, onIncreaseChange }: OddSectionProps) {
  return (
    <>
      <label className="block mb-2">Odd</label>
      <input
        type="text"
        className="w-full p-2 rounded bg-[#2c3545] text-white"
        value={data.odd}
        onChange={onOddChange}
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
        onChange={onIncreaseChange}
      />
    </>
  );
}
