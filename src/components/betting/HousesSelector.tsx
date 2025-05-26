
import React from "react";

interface HousesSelectorProps {
  numBets: number;
  onNumBetsChange: (num: number) => void;
}

export function HousesSelector({ numBets, onNumBetsChange }: HousesSelectorProps) {
  return (
    <div className="mb-6 relative z-10">
      <label className="mr-4">Número de Casas:</label>
      <select
        value={numBets}
        onChange={(e) => onNumBetsChange(Number(e.target.value))}
        className="p-2 bg-[#2c3545] text-white rounded"
      >
        {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
    </div>
  );
}
