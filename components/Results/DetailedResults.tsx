import { PlayerData, PlayerPoints } from "@/utils/interfaces/Match"
import { msToTime } from "@/utils/ui/timing";
import { uuidToHead } from "@/utils/ui/uuid"
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
  playerRoundData: PlayerData[][] | PlayerPoints[][]
  isUsingPoints: boolean
}

export const DetailedResults = ({ playerRoundData, isUsingPoints }: Props) => {
  if (playerRoundData.length === 0 || playerRoundData[0].length === 0) {
    return;
  }

  return (
    <Card>

      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg">Player</TableHead>
              {
                playerRoundData[0].map((_, i) => <TableHead key={i} className="text-lg">R{i + 1}</TableHead>)
              }
              {isUsingPoints && <TableHead className="text-lg">Total</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {playerRoundData.map((prs) => {

              return (
                <TableRow key={prs[0].uuid}>
                  <TableCell>
                    <Image
                      className="mx-auto"
                      alt="avatar"
                      src={uuidToHead(prs[0].uuid)}
                      width={24}
                      height={24}
                      unoptimized
                    />
                  </TableCell>
                  {
                    prs.map((pp, j) => (
                      <TableCell key={j} className="text-base">{isUsingPoints ? (pp as PlayerPoints).points : (pp.time === -1 ? "DNF" : msToTime(pp.time))}</TableCell>
                    ))
                  }
                  {isUsingPoints && <TableCell className="text-base font-bold">{(prs[prs.length - 1] as PlayerPoints).sumOfPoints}</TableCell>}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}