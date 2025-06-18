
import React from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

interface CalculatorToggleProps {
  activeCalculator: "cashback" | "surebet";
  onToggle: (calculator: "cashback" | "surebet") => void;
}

export const CalculatorToggle: React.FC<CalculatorToggleProps> = ({
  activeCalculator,
  onToggle,
}) => {
  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
      <Button
        onClick={() => onToggle("cashback")}
        variant={activeCalculator === "cashback" ? "default" : "outline"}
        size="sm"
        className={`flex items-center gap-2 ${
          activeCalculator === "cashback"
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <Calculator size={16} />
        Cashback
      </Button>
      <Button
        onClick={() => onToggle("surebet")}
        variant={activeCalculator === "surebet" ? "default" : "outline"}
        size="sm"
        className={`flex items-center gap-2 ${
          activeCalculator === "surebet"
            ? "bg-yellow-600 hover:bg-yellow-700"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <TrendingUp size={16} />
        Surebet
      </Button>
    </div>
  );
};
