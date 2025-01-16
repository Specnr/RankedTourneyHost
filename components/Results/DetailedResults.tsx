import { PlayerData, PlayerPoints } from "@/utils/interfaces/Match"
import { msToTime } from "@/utils/ui/timing";
import { uuidToHead } from "@/utils/ui/uuid"
import Image from "next/image";

interface Props {
  playerRoundData: PlayerData[][] | PlayerPoints[][]
  isUsingPoints: boolean
}

export const DetailedResults = ({ playerRoundData, isUsingPoints }: Props) => {
  if (playerRoundData.length === 0 || playerRoundData[0].length === 0) {
    return;
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 max-h-[75vh] overflow-y-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-700 text-center">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-2 px-4 text-sm font-semibold text-gray-300">Player</th>
            {
              playerRoundData[0].map((_, i) => <th key={i} className="py-2 px-4 text-sm font-semibold text-gray-300">R{i + 1}</th>)
            }
            { isUsingPoints && <th className="py-2 px-4 text-sm font-semibold text-gray-300">Total</th> }
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {playerRoundData.map((prs) => (
            <tr
              key={prs[0].uuid}
              className="hover:bg-gray-700 transition"
            >
              <td>
                <Image
                  className="mx-auto"
                  alt="avatar"
                  src={uuidToHead(prs[0].uuid)}
                  width={20}
                  height={20}
                  unoptimized
                />
              </td>
              {
                prs.map((pp, j) => (
                  <td key={j} className="py-3 px-4 text-blue-400 font-medium">{ isUsingPoints ? (pp as PlayerPoints).points : (pp.time === -1 ? "DNF" : msToTime(pp.time)) }</td>
                ))
              }
              { isUsingPoints && <td className="py-3 px-4 text-sm font-semibold text-gray-300">{ (prs[prs.length - 1] as PlayerPoints).sumOfPoints }</td> }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}