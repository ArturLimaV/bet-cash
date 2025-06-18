
import React, { useState } from "react";
import SurebetCalculator from "@/components/SurebetCalculator";
import { ApostaBoostedCalculator } from "@/components/ApostaBoostedCalculator";
import CashbackCalculator from "@/components/SurebetCalculator"; // Renomeando a calculadora original
import NewSurebetCalculator from "@/components/SurebetCalculator"; // Nova calculadora
import { CalculatorToggle } from "@/components/CalculatorToggle";

const Index = () => {
  const [activeCalculator, setActiveCalculator] = useState<"cashback" | "surebet">("cashback");

  return (
    <div className="relative">
      <CalculatorToggle 
        activeCalculator={activeCalculator}
        onToggle={setActiveCalculator}
      />
      
      {activeCalculator === "cashback" ? (
        <SurebetCalculator />
      ) : (
        <NewSurebetCalculator />
      )}
    </div>
  );
};

export default Index;
