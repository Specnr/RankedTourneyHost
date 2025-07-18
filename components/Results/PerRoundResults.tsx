import { PlayerData, PlayerPoints } from "@/utils/interfaces/Match";
import { msToTime } from "@/utils/ui/timing";
import { uuidToHead } from "@/utils/ui/uuid";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  playerRoundData: PlayerData[][] | PlayerPoints[][];
  isUsingPoints: boolean;
  uuidToNameMap: { [uuid: string]: string };
}

export const PerRoundResults = ({ playerRoundData, isUsingPoints, uuidToNameMap }: Props) => {
  const [selectedRound, setSelectedRound] = useState(0);
  if (!playerRoundData || playerRoundData.length === 0 || playerRoundData[0].length === 0) {
    return <div className="text-center text-gray-400">No per-round data available.</div>;
  }

  // Transpose playerRoundData to get rounds as first dimension
  const numRounds = playerRoundData[0].length;
  const rounds: (PlayerData[] | PlayerPoints[])[] = Array.from({ length: numRounds }, (_, roundIdx) =>
    playerRoundData.map(playerArr => playerArr[roundIdx]).filter(x => x)
  );

  return (
    <Card>

      <CardContent className="p-4">
        <div className="flex justify-center mb-4">
          <Select onValueChange={(value) => setSelectedRound(Number(value))}>
            <SelectTrigger className="w-[180px] bg-secondary border-secondary">
              <SelectValue className="text-white" placeholder={`Round ${selectedRound + 1}`} />
            </SelectTrigger>
            <SelectContent>
              {rounds.map((_, idx) => (
                <SelectItem key={idx} value={idx.toString()}>Round {idx + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg w-1/12 hidden sm:table-cell">Player</TableHead>
              <TableHead className="text-lg">Name</TableHead>
              <TableHead className="text-lg">Result</TableHead>
              {isUsingPoints && <TableHead className="text-lg">Points</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rounds[selectedRound]
              .slice() // avoid mutating original data
              // Filter out players with 0 points if using points
              .filter(pd => !isUsingPoints || (pd as PlayerPoints).points > 0)
              .sort((a, b) => {
                const aTime = isUsingPoints ? (a as PlayerPoints).time : (a as PlayerData).time;
                const bTime = isUsingPoints ? (b as PlayerPoints).time : (b as PlayerData).time;
                // DNF (time === -1) should be sorted last
                if (aTime === -1 && bTime === -1) return 0;
                if (aTime === -1) return 1;
                if (bTime === -1) return -1;
                return aTime - bTime;
              })
              .map((pd, idx) => {
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
                  <TableRow key={pd.uuid} className={`${textColorClass} ${fontWeightClass}`}>
                    <TableCell className="w-1/12 hidden sm:table-cell">
                      <Image
                        className="mx-auto hidden sm:inline-block"
                        alt="avatar"
                        src={uuidToHead(pd.uuid)}
                        width={24}
                        height={24}
                        unoptimized
                      />
                    </TableCell>
                    <TableCell className="text-base">
                      {uuidToNameMap[pd.uuid] || pd.uuid}
                    </TableCell>
                    <TableCell className="text-base">
                      {isUsingPoints
                        ? (pd as PlayerPoints).time === -1
                          ? "DNF"
                          : msToTime((pd as PlayerPoints).time)
                        : (pd as PlayerData).time === -1
                          ? "DNF"
                          : msToTime((pd as PlayerData).time)
                      }
                    </TableCell>
                    {isUsingPoints && (
                      <TableCell className="text-base">
                        {(pd as PlayerPoints).points}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};