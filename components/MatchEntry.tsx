import { useEffect, useState } from "react"
import Image from "next/image";

import { Match } from "@/utils/interfaces/Match"
import { uuidToHead, uuidToIGN } from "@/utils/ui/uuid"
import { msToTime } from "@/utils/ui/timing"
import { Spinner } from "./Spinner";

interface Props {
  match: Match
}

export const MatchEntry = ({ match }: Props) => {
  const [ign, setIgn] = useState(null)
  const [loading, setLoading] = useState(true);

  // Load IGN on mount
  useEffect(() => {
    const fetchData = async () => {
      setIgn(await uuidToIGN(match.result.uuid))
      setLoading(false)
    }

    fetchData();
  }, [match.result.uuid])

  const handleButtonClick = () => {
    console.log("click")
  }

  if (loading){
    return <Spinner />
  }
  
  return (
    <div
      className="mt-4 px-2 shadow-lg rounded-lg bg-gray-700"
    >
      <div className="grid grid-rows-2 grid-cols-8 items-center">
        <p className="row-span-1 col-span-7">
          {match.id} - {new Date(match.date * 1000).toLocaleString()}
        </p>
        <div className="row-span-2 col-span-1 ml-2 flex justify-center items-center">
          <button
            className="rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent div's onClick
              handleButtonClick();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p className="row-span-1 col-span-7 inline-flex items-center space-x-2">
          {ign && (
              <>
                {
                  match.result.uuid && (
                    <Image
                      alt="avatar"
                      src={uuidToHead(match.result.uuid)}
                      width={20}
                      height={20}
                      unoptimized
                    />
                  )
                }
                <span>{ign} - {msToTime(match.result.time)}</span>
              </>
            )
          }
        </p>
      </div>
    </div>
  );
}