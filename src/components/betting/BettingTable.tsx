
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

interface BettingTableProps {
  tableData: TableRowData[];
  minReturn: number;
}

export const BettingTable: React.FC<BettingTableProps> = ({ tableData, minReturn }) => {
  return (
    <div className="mt-10 w-full max-w-4xl overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Distribuição das apostas</h2>
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
              <TableCell className="px-4 py-2">Casa {data.index + 1}</TableCell>
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

      <div className="mt-4 text-right">
        <p className="text-lg">
          Retorno garantido: <span className="text-green-400 font-bold">R$ {minReturn.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};
