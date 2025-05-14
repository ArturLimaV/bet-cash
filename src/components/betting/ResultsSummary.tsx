
import React from "react";

interface ResultsSummaryProps {
  guaranteedProfit: number;
  totalInvested: number;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ guaranteedProfit, totalInvested }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Resultados</h2>
      <p>
        Lucro garantido:{" "}
        <span className={guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}>
          <strong>R$ {guaranteedProfit.toFixed(2)}</strong>
        </span>
      </p>
      <p>
        ROI:{" "}
        <span className={guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}>
          <strong>
            {totalInvested > 0 ? ((guaranteedProfit / totalInvested) * 100).toFixed(2) : "0.00"}%
          </strong>
        </span>
      </p>
      <p>
        Investimento total:{" "}
        <span className="text-white font-bold">R$ {totalInvested.toFixed(2)}</span>
      </p>
    </div>
  );
};
