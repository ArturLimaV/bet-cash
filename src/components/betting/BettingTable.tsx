
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
import { Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BettingTableProps {
  tableData: TableRowData[];
  minReturn: number;
  freebetIndexes: number[];
}

export const BettingTable: React.FC<BettingTableProps> = ({ tableData, minReturn, freebetIndexes = [] }) => {
  const isMobile = useIsMobile();
  
  const FreebetIndicator = () => (
    <Badge variant="outline" className="bg-betting-green text-white flex items-center gap-1 text-xs font-normal">
      <Gift size={12} />
      Freebet
    </Badge>
  );
  
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
                  {freebetIndexes.includes(data.index) && <FreebetIndicator />}
                </div>
                
                <div className="font-medium">Valor:</div>
                <div>R$ {data.value.toFixed(2)}</div>
                
                <div className="font-medium">% da Aposta:</div>
                <div>{data.percentage}%</div>
                
                <div className="font-medium">Lucro:</div>
                <div className={`font-semibold ${data.lucroClass}`}>
                  R$ {data.lucro.toFixed(2)}
                </div>
                
                <div className="font-medium">Retorno:</div>
                <div>R$ {data.retorno.toFixed(2)}</div>
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
                    {freebetIndexes.includes(data.index) && <FreebetIndicator />}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">R$ {data.value.toFixed(2)}</TableCell>
                <TableCell className="px-4 py-2">{data.percentage}%</TableCell>
                <TableCell className={`px-4 py-2 font-semibold ${data.lucroClass}`}>
                  R$ {data.lucro.toFixed(2)}
                </TableCell>
                <TableCell className="px-4 py-2">R$ {data.retorno.toFixed(2)}</TableCell>
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
