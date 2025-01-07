import { useState } from "react"
import Image from "next/image";

import { Match } from "@/utils/interfaces/Match"
import { uuidToHead, uuidToIGN } from "@/utils/ui/uuid"
import { msToTime } from "@/utils/ui/timing"

interface Props {
  match: Match
}

export const MatchEntry = ({ match }: Props) => {
  const [ign, setIgn] = useState(null)

  const handleClick = async () => {
    setIgn(ign ? null : await uuidToIGN(match.result.uuid))
  }
  
  return (
    <div className="mt-4 px-2 shadow-lg rounded-lg bg-gray-700" onClick={handleClick}>
      <p>{ match.id } - { new Date(match.date * 1000).toLocaleString() }</p>
      { 
        ign && (
          <p className="inline-flex items-center space-x-2">
            { match.result.uuid && 
              <Image
                alt="avatar"
                src={uuidToHead(match.result.uuid)}
                width={20}
                height={20}
                unoptimized
              />
            }
            <span>{ ign } - { msToTime(match.result.time) }</span>
          </p>
        )
      }
    </div>
  )
}