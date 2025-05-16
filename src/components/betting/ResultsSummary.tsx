
import React from "react";

interface ResultsSummaryProps {
  guaranteedProfit: number;
  totalInvested: number;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ guaranteedProfit, totalInvested }) => {
  // Função de formatação que lida com NaN
  const formatValue = (value: number): string => {
    return isNaN(value) ? "NaN" : `R$ ${value.toFixed(2)}`;
  };

  // Função de formatação para percentagem que lida com NaN
  const formatPercentage = (profit: number, invested: number): string => {
    if (isNaN(profit) || invested <= 0) return isNaN(profit) ? "NaN" : "0.00%";
    return `${((profit / invested) * 100).toFixed(2)}%`;
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Resultados</h2>
      <p>
        Lucro garantido:{" "}
        <span className={guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}>
          <strong>{formatValue(guaranteedProfit)}</strong>
        </span>
      </p>
      <p>
        ROI:{" "}
        <span className={guaranteedProfit >= 0 ? "text-green-400" : "text-red-400"}>
          <strong>
            {formatPercentage(guaranteedProfit, totalInvested)}
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
