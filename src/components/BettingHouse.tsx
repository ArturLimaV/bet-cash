
import React from "react";

interface BettingData {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
}

interface BettingHouseProps {
  index: number;
  data: BettingData;
  onChange: (index: number, data: BettingData) => void;
  onFixStake: (index: number) => void;
  isFixed?: boolean;
}

export function BettingHouse({ index, data, onChange, onFixStake, isFixed }: BettingHouseProps) {
  const rawOdd = parseFloat(data.odd);
  let baseOdd = data.type === "Lay" && rawOdd > 1 ? rawOdd / (rawOdd - 1) : rawOdd;

  if (data.hasCommission && data.commission !== "") {
    const commissionValue = parseFloat(data.commission);
    if (!isNaN(commissionValue)) {
      baseOdd = 1 + ((baseOdd - 1) * (1 - commissionValue / 100));
    }
  }

  const realOdd = baseOdd?.toFixed(3);

  return (
    <div className="bg-betting-card text-white p-3 md:p-6 rounded-lg w-full sm:w-auto max-w-full sm:max-w-xs border border-gray-700">
      <div className="text-center text-lg md:text-xl font-bold mb-2 md:mb-4">Casa {index + 1}</div>

      <label className="block mb-1 md:mb-2 text-sm md:text-base">Odd</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-1 md:p-2 rounded bg-betting-input text-white text-sm md:text-base"
        value={data.odd}
        onChange={(e) => onChange(index, { ...data, odd: e.target.value })}
      />
      <p className="text-yellow-400 text-xs mt-0.5 md:mt-1">Odd real: {realOdd}</p>

      <label className="block mt-3 md:mt-4 mb-1 md:mb-2 text-sm md:text-base">Tipo</label>
      <select
        className="w-full p-1 md:p-2 rounded bg-betting-input text-white mb-3 md:mb-4 text-sm md:text-base"
        value={data.type}
        onChange={(e) => onChange(index, { ...data, type: e.target.value })}
      >
        <option value="Back">Back</option>
        <option value="Lay">Lay</option>
      </select>

      <label className="block mb-1 md:mb-2 text-sm md:text-base">Valor</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-1 md:p-2 rounded bg-betting-input text-white mb-3 md:mb-4 text-sm md:text-base"
        value={data.value}
        onChange={(e) => onChange(index, { ...data, value: e.target.value })}
      />

      <div className="mb-2">
        <label className="flex items-center text-sm md:text-base">
          <input
            type="checkbox"
            className="mr-2 h-3 w-3 md:h-4 md:w-4"
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
            className="w-full mt-1 p-1 md:p-2 rounded bg-betting-input text-white text-xs md:text-sm"
            value={data.commission || ""}
            onChange={(e) => onChange(index, { ...data, commission: e.target.value })}
          />
        )}
      </div>

      <div className="mb-3 md:mb-4">
        <label className="flex items-center text-sm md:text-base">
          <input
            type="checkbox"
            className="mr-2 h-3 w-3 md:h-4 md:w-4"
            checked={data.hasFreebet}
            onChange={(e) => onChange(index, { ...data, hasFreebet: e.target.checked })}
          />
          Freebet
        </label>
      </div>

      <button
        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1.5 md:py-2 px-2 md:px-4 rounded disabled:opacity-50 transition-colors text-sm md:text-base"
        onClick={() => onFixStake(index)}
      >
        Fixar Stake
      </button>
    </div>
  );
}
