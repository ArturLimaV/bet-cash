
import React, { useState } from "react";
import { BettingHouse } from "./BettingHouse";
import { BettingTable } from "./betting/BettingTable";
import { ResultsSummary } from "./betting/ResultsSummary";
import { HousesSelector } from "./betting/HousesSelector";
import { SocialFooter } from "./betting/SocialFooter";
import { Logo } from "./Logo";
import { useBetCalculations } from "@/hooks/useBetCalculations";

export default function SurebetCalculator() {
  const [numBets, setNumBets] = useState(3);
  
  const {
    activeBets,
    fixedStakeIndex,
    tableData,
    totalInvested,
    minReturn,
    guaranteedProfit,
    handleChange,
    handleFixStake,
    handleUnfixStake
  } = useBetCalculations(numBets);

  const handleNumBetsChange = (num: number) => {
    setNumBets(num);
  };

  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4 relative">
      <div className="w-full max-w-xs md:max-w-full relative z-10">
        <Logo />
      </div>
      
      <h1 className="text-3xl font-bold mb-8 relative z-10">Calculadora de Surebet</h1>

      <HousesSelector numBets={numBets} onNumBetsChange={handleNumBetsChange} />

      <div className="flex gap-4 flex-wrap justify-center relative z-10">
        {activeBets.map((bet, index) => (
          <BettingHouse
            key={index}
            index={index}
            data={bet}
            onChange={handleChange}
            onFixStake={handleFixStake}
            onUnfixStake={handleUnfixStake}
            isStakeFixed={fixedStakeIndex === index}
          />
        ))}
      </div>

      <BettingTable 
        tableData={tableData} 
        minReturn={minReturn}
        freebetIndexes={[]}
      />
      <ResultsSummary guaranteedProfit={guaranteedProfit} totalInvested={totalInvested} />

      <SocialFooter />
    </div>
  );
}
