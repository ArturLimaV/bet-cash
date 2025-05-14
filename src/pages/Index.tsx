
import SurebetCalculator from "@/components/SurebetCalculator";
import { ApostaBoostedCalculator } from "@/components/ApostaBoostedCalculator";

const Index = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 md:w-1/4">
        <ApostaBoostedCalculator />
      </div>
      <div className="md:w-3/4">
        <SurebetCalculator />
      </div>
    </div>
  );
};

export default Index;
