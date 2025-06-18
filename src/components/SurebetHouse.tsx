
import React from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock, LockOpen } from "lucide-react";
import { Bet } from "@/types/betting-types";

interface SurebetHouseProps {
  index: number;
  data: Bet;
  onChange: (index: number, updatedBet: Bet) => void;
  onFixStake: (index: number) => void;
  onUnfixStake: (index: number) => void;
  isStakeFixed: boolean;
}

export const SurebetHouse: React.FC<SurebetHouseProps> = ({
  index,
  data,
  onChange,
  onFixStake,
  onUnfixStake,
  isStakeFixed,
}) => {
  const handleChange = (field: keyof Bet, value: string | boolean) => {
    if (field === "odd" && value === "") {
      onUnfixStake(index);
    }
    
    const updatedBet = { ...data, [field]: value };
    onChange(index, updatedBet);
  };

  const handleCheckboxChange = (field: "commission" | "freebet") => {
    const updatedBet = { ...data, [field]: !data[field] };
    onChange(index, updatedBet);
  };

  const realOdd = () => {
    const baseOdd = parseFloat(data.odd) || 0;
    if (data.boost) {
      const boostPercentage = parseFloat(data.boost) || 0;
      return ((baseOdd - 1) * (1 + boostPercentage / 100) + 1).toFixed(2);
    }
    return baseOdd.toFixed(2);
  };

  return (
    <Card className="bg-betting-card w-full md:max-w-xs text-white border border-gray-700">
      <CardHeader className="pb-3 md:pb-4 pt-4 md:pt-6">
        <CardTitle className="text-center text-white text-base md:text-lg">
          Casa {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {/* Odd */}
        <div>
          <label className="block text-white text-xs md:text-sm font-medium mb-1">
            Odd
          </label>
          <Input
            type="number"
            step="0.01"
            min="1"
            value={data.odd}
            onChange={(e) => handleChange("odd", e.target.value)}
            className="bg-betting-input text-white h-8 md:h-10 text-sm md:text-base border-gray-600"
          />
          {data.boost && (
            <p className="text-xs text-yellow-400 mt-1">
              Odd real: {realOdd()}
            </p>
          )}
        </div>

        {/* Aumento % */}
        <div>
          <label className="block text-white text-xs md:text-sm font-medium mb-1">
            Aumento (%)
          </label>
          <Input
            type="number"
            step="0.1"
            min="0"
            value={data.boost || ""}
            onChange={(e) => handleChange("boost", e.target.value)}
            placeholder="Digite o aumento %"
            className="bg-betting-input text-white h-8 md:h-10 text-sm md:text-base border-gray-600"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-white text-xs md:text-sm font-medium mb-1">
            Tipo
          </label>
          <select
            value={data.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full bg-betting-input text-white h-8 md:h-10 text-sm md:text-base border border-gray-600 rounded-md px-3"
          >
            <option value="Back">Back</option>
            <option value="Lay">Lay</option>
          </select>
        </div>

        {/* Valor */}
        <div>
          <label className="block text-white text-xs md:text-sm font-medium mb-1">
            Valor
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={data.value}
            onChange={(e) => handleChange("value", e.target.value)}
            className="bg-betting-input text-white h-8 md:h-10 text-sm md:text-base border-gray-600"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-xs md:text-sm">
            <input
              type="checkbox"
              checked={data.commission || false}
              onChange={() => handleCheckboxChange("commission")}
              className="rounded"
            />
            <span className="text-white">Comissão</span>
          </label>
          <label className="flex items-center space-x-2 text-xs md:text-sm">
            <input
              type="checkbox"
              checked={data.freebet || false}
              onChange={() => handleCheckboxChange("freebet")}
              className="rounded"
            />
            <span className="text-white">Freebet</span>
          </label>
        </div>

        {/* Fixar Stake Button */}
        <button
          onClick={() => onFixStake(index)}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            isStakeFixed
              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
              : "bg-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          {isStakeFixed ? <Lock size={16} /> : <LockOpen size={16} />}
          {isStakeFixed ? "Stake Fixada" : "Fixar Stake"}
        </button>
      </CardContent>
    </Card>
  );
};
