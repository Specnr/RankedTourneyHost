import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { NamedResults } from "@/utils/interfaces/Event";
import Image from "next/image";
import { uuidToHead } from "@/utils/ui/uuid";

interface Props {
  results: NamedResults[];
  isUsingPoints: boolean;
}

export const SimpleResults = ({ results, isUsingPoints }: Props) => {
  const filteredResults = results.filter((nr) => nr.points ? nr.points! > 0 : true);

  return (
    <Card className="rounded-b-md">

      <CardContent className="p-4">
        <div className="max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-400px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg w-1/12">#</TableHead>
                <TableHead className="text-lg w-1/12 hidden sm:table-cell">Player</TableHead>
                <TableHead className="text-lg">IGN</TableHead>
                {isUsingPoints && <TableHead className="text-lg">Points</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((nr, idx) => {
                const isTop3 = idx < 3;
                const textColorClass = isTop3
                  ? idx === 0
                    ? "text-gold"
                    : idx === 1
                      ? "text-silver"
                      : "text-bronze"
                  : "";
                const fontWeightClass = isTop3 ? "font-bold" : "";

                return (
                  <TableRow key={idx} className={`${textColorClass} ${fontWeightClass}`}>
                    <TableCell className="text-base w-1/12">{idx + 1}</TableCell>
                    <TableCell className="w-1/12 hidden sm:table-cell">
                      <Image
                        alt="avatar"
                        src={uuidToHead(nr.uuid)}
                        width={24}
                        height={24}
                        unoptimized
                        className="hidden sm:inline-block mr-2"
                      />
                    </TableCell>
                    <TableCell className="text-base">{nr.nickname}</TableCell>
                    {isUsingPoints && <TableCell className="text-base">{nr.points}</TableCell>}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};