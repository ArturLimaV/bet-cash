
import React from "react";
import { Bet } from "@/types/betting-types";

interface BetTypeSelectorProps {
  data: Bet;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function BetTypeSelector({ data, onChange }: BetTypeSelectorProps) {
  return (
    <>
      <label className="block mt-4 mb-2">Tipo</label>
      <select
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.type}
        onChange={onChange}
      >
        <option value="Back">Back</option>
        <option value="Lay">Lay</option>
      </select>
    </>
  );
}
