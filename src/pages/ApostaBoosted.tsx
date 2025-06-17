
import { ApostaBoostedCalculator } from "@/components/ApostaBoostedCalculator";

const ApostaBoosted = () => {
  return (
    <div className="min-h-screen bg-[#121c2b] text-white flex flex-col items-center py-8 px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{
        backgroundImage: "url('/lovable-uploads/28bd1147-f993-4695-b904-b131571e6920.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px auto",
        opacity: 0.03
      }}>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-center">Bet sem medo</h1>
        <ApostaBoostedCalculator />
      </div>
    </div>
  );
};

export default ApostaBoosted;
