
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableRowData } from "@/types/betting-types";

interface BettingTableProps {
  tableData: TableRowData[];
  minReturn: number;
  freebetIndexes: number[];
}

export function BettingTable({ tableData, minReturn, freebetIndexes }: BettingTableProps) {
  return (
    <div className="mt-8 bg-[#1b2432] p-6 rounded-lg w-full relative z-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-center">Distribuição de Apostas</h2>
        
        <Table>
          <TableHeader>
            <TableRow className="border-gray-600">
              <TableHead className="text-gray-300">Casa</TableHead>
              <TableHead className="text-gray-300">Valor</TableHead>
              <TableHead className="text-gray-300">%</TableHead>
              <TableHead className="text-gray-300">Lucro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.index} className="border-gray-600">
                <TableCell className="text-white">{row.houseName}</TableCell>
                <TableCell className="text-white">R$ {row.value.toFixed(2)}</TableCell>
                <TableCell className="text-white">{row.percentage}%</TableCell>
                <TableCell className={row.lucroClass}>R$ {row.lucro.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
