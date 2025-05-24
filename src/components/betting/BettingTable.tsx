
import React from "react";
import { TableRowData } from "@/types/betting-types";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface BettingTableProps {
  tableData: TableRowData[];
  minReturn: number;
  freebetIndexes: number[];
}

export const BettingTable: React.FC<BettingTableProps> = ({ tableData, minReturn, freebetIndexes = [] }) => {
  const isMobile = useIsMobile();
  
  // Helper function to format the bet value display based on bet type
  const formatBetValue = (data: TableRowData) => {
    // Check if the row has layStake property and it's a valid number
    if (data.betType === 'Lay' && data.layStake !== undefined) {
      return (
        <>
          R$ {data.value.toFixed(2)} Lay (Stake: R$ {data.layStake.toFixed(2)})
        </>
      );
    }
    
    // Default display for Back bets or when no stake is available
    return `R$ ${data.value.toFixed(2)}`;
  };

  // Helper function to format return value including cashback when losing
  const formatReturnValue = (data: TableRowData, isWinning: boolean) => {
    if (isWinning) {
      return `R$ ${data.retorno.toFixed(2)}`;
    } else {
      // When losing, show cashback as return if it exists
      if (data.cashbackValue && data.cashbackValue > 0) {
        return `R$ ${data.cashbackValue.toFixed(2)}`;
      }
      return "R$ 0.00";
    }
  };
  
  return (
    <div className="mt-10 w-full max-w-4xl overflow-x-auto relative z-10">
      <h2 className="text-xl font-semibold mb-4 text-center">Distribuição das apostas</h2>
      
      {isMobile ? (
        // Visualização vertical para dispositivos móveis
        <div className="space-y-4">
          {tableData.map((data) => (
            <div key={data.index} className="bg-[#2c3545] p-4 rounded-md shadow-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Casa:</div>
                <div className="flex flex-col gap-1">
                  <span>Casa {data.index + 1}</span>
                </div>
                
                <div className="font-medium">Valor:</div>
                <div>{formatBetValue(data)}</div>
                
                <div className="font-medium">% da Aposta:</div>
                <div>{data.percentage}%</div>
                
                <div className="font-medium">Lucro:</div>
                <div className={`font-semibold ${data.lucroClass}`}>
                  R$ {data.lucro.toFixed(2)}
                </div>
                
                <div className="font-medium">Retorno:</div>
                <div>{formatReturnValue(data, true)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Visualização em tabela para desktop
        <Table className="w-full text-left border-collapse min-w-[600px]">
          <TableHeader>
            <TableRow className="bg-[#1b2432]">
              <TableHead className="px-4 py-2">Casa</TableHead>
              <TableHead className="px-4 py-2">Valor</TableHead>
              <TableHead className="px-4 py-2">% da Aposta</TableHead>
              <TableHead className="px-4 py-2">Lucro</TableHead>
              <TableHead className="px-4 py-2">Retorno</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.index} className="bg-[#2c3545]">
                <TableCell className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span>Casa {data.index + 1}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">{formatBetValue(data)}</TableCell>
                <TableCell className="px-4 py-2">{data.percentage}%</TableCell>
                <TableCell className={`px-4 py-2 font-semibold ${data.lucroClass}`}>
                  R$ {data.lucro.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {formatReturnValue(data, true)}
                  {data.cashbackValue && data.cashbackValue > 0 && (
                    <div className="text-xs text-blue-400 mt-1">
                      (Cashback se perder: R$ {data.cashbackValue.toFixed(2)})
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-4 text-right">
        <p className="text-lg">
          Retorno garantido: <span className="text-white font-bold">R$ {minReturn.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};
