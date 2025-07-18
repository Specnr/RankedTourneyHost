import { uuidToHead } from "@/utils/ui/uuid"
import Image from "next/image";
import { SimpleResultsEntry } from "./SimpleResultsEntry";
import { NamedResults } from "@/utils/interfaces/Event";

interface Props {
  results: NamedResults[]
}

export const SimpleResults = ({ results }: Props) => {
  // Filter out people with no points
  const filteredResults = results.filter(nr => nr.points && nr.points > 0);
  return (
    <ol className="max-h-[70vh] overflow-y-auto divide-y divide-gray-700">
      {filteredResults.map((nr, idx) => {
        return (
          <li
            key={idx}
            className="py-3 px-4 hover:bg-gray-700 rounded grid grid-cols-8"
          >
            <span className="text-lg font-medium text-white col-span-1">{idx + 1}.</span>
            <div className="col-span-1 my-auto">
              <Image
                alt="avatar"
                src={uuidToHead(nr.uuid)}
                width={20}
                height={20}
                unoptimized
              />
            </div>
            <SimpleResultsEntry ign={nr.nickname} place={idx + 1} points={nr.points} />
          </li>
        )
      })}
    </ol>
  )
}