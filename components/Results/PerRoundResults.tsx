import { PlayerData, PlayerPoints } from "@/utils/interfaces/Match";
import { msToTime } from "@/utils/ui/timing";
import { uuidToHead } from "@/utils/ui/uuid";
import Image from "next/image";
import { useState } from "react";

interface Props {
  playerRoundData: PlayerData[][] | PlayerPoints[][];
  isUsingPoints: boolean;
}

export const PerRoundResults = ({ playerRoundData, isUsingPoints }: Props) => {
  const [selectedRound, setSelectedRound] = useState(0);
  if (!playerRoundData || playerRoundData.length === 0 || playerRoundData[0].length === 0) {
    return <div className="text-center text-gray-400">No per-round data available.</div>;
  }

  // Transpose playerRoundData to get rounds as first dimension
  const numRounds = playerRoundData[0].length;
  const rounds: (PlayerData[] | PlayerPoints[])[] = Array.from({ length: numRounds }, (_, roundIdx) =>
    playerRoundData.map(playerArr => playerArr[roundIdx])
  );


  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 max-h-[75vh] overflow-y-auto">
      <div className="flex justify-center mb-4">
        <label htmlFor="round-selector" className="mr-2 text-gray-300 font-medium">Select Round:</label>
        <select
          id="round-selector"
          className="bg-gray-700 text-gray-200 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedRound}
          onChange={e => setSelectedRound(Number(e.target.value))}
        >
          {rounds.map((_, idx) => (
            <option key={idx} value={idx}>Round {idx + 1}</option>
          ))}
        </select>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-200">Round {selectedRound + 1}</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-700 text-center mb-4">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4 text-sm font-semibold text-gray-300">Player</th>
              <th className="py-2 px-4 text-sm font-semibold text-gray-300">Result</th>
              {isUsingPoints && <th className="py-2 px-4 text-sm font-semibold text-gray-300">Points</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rounds[selectedRound]
              .slice() // avoid mutating original data
              .sort((a, b) => {
                const aTime = isUsingPoints ? (a as PlayerPoints).time : (a as PlayerData).time;
                const bTime = isUsingPoints ? (b as PlayerPoints).time : (b as PlayerData).time;
                // DNF (time === -1) should be sorted last
                if (aTime === -1 && bTime === -1) return 0;
                if (aTime === -1) return 1;
                if (bTime === -1) return -1;
                return aTime - bTime;
              })
              .map((pd) => (
                <tr key={pd.uuid} className="hover:bg-gray-700 transition">
                  <td>
                    <Image
                      className="mx-auto"
                      alt="avatar"
                      src={uuidToHead(pd.uuid)}
                      width={20}
                      height={20}
                      unoptimized
                    />
                  </td>
                  <td className="py-3 px-4 text-blue-400 font-medium">
                    {isUsingPoints
                      ? (pd as PlayerPoints).time === -1
                        ? "DNF"
                        : msToTime((pd as PlayerPoints).time)
                      : (pd as PlayerData).time === -1
                        ? "DNF"
                        : msToTime((pd as PlayerData).time)
                    }
                  </td>
                  {isUsingPoints && (
                    <td className="py-3 px-4 text-sm font-semibold text-gray-300">
                      {(pd as PlayerPoints).points}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 