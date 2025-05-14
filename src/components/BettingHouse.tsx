
import React from "react";

interface BettingData {
  odd: string;
  value: string;
  type: string;
  hasCommission: boolean;
  commission: string;
  hasFreebet: boolean;
  stakeIncrease: string; // Mantemos o campo de aumento de aposta
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

  // Apply commission if present
  if (data.hasCommission && data.commission !== "") {
    const commissionValue = parseFloat(data.commission);
    if (!isNaN(commissionValue)) {
      baseOdd = 1 + ((baseOdd - 1) * (1 - commissionValue / 100));
    }
  }
  
  // Apply stake increase if present
  if (data.stakeIncrease && data.stakeIncrease !== "") {
    const increaseValue = parseFloat(data.stakeIncrease);
    if (!isNaN(increaseValue)) {
      baseOdd = ((baseOdd - 1) * (1 + (increaseValue / 100))) + 1;
    }
  }

  const realOdd = baseOdd?.toFixed(3);

  return (
    <div className="bg-[#1b2432] text-white p-6 rounded-lg w-full max-w-xs border border-gray-700">
      <div className="text-center text-xl font-bold mb-4">Casa {index + 1}</div>

      <label className="block mb-2">Odd</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-2 rounded bg-[#2c3545] text-white"
        value={data.odd}
        onChange={(e) => onChange(index, { ...data, odd: e.target.value })}
      />
      <p className="text-yellow-400 text-xs mt-1">Odd real: {realOdd}</p>

      <label className="block mt-4 mb-2">Tipo</label>
      <select
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.type}
        onChange={(e) => onChange(index, { ...data, type: e.target.value })}
      >
        <option value="Back">Back</option>
        <option value="Lay">Lay</option>
      </select>

      {/* Campo para aumento de aposta */}
      <label className="block mb-2">Aumento de Aposta (%)</label>
      <input
        type="number"
        step="0.1"
        placeholder="Ex: 25 para 25%"
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.stakeIncrease || ""}
        onChange={(e) => onChange(index, { ...data, stakeIncrease: e.target.value })}
      />

      <label className="block mb-2">Valor</label>
      <input
        type="number"
        step="0.01"
        className="w-full p-2 rounded bg-[#2c3545] text-white mb-4"
        value={data.value}
        onChange={(e) => onChange(index, { ...data, value: e.target.value })}
      />

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
        className="w-full bg-gray-600 text-white py-2 px-4 rounded disabled:opacity-50"
        onClick={() => onFixStake(index)}
        disabled={!(parseFloat(data.value) > 0)}
      >
        Fixar Stake
      </button>
    </div>
  );
}
