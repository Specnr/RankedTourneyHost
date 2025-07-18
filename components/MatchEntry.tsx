import { useEffect, useState } from "react";
import Image from "next/image";
import { Match } from "@/utils/interfaces/Match";
import { uuidToHead, uuidToIGN } from "@/utils/ui/uuid";
import { msToTime } from "@/utils/ui/timing";
import { Spinner } from "./Spinner";
import { Minus, Plus } from "./SVGs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  isAdding: boolean;
  handleMatchChange: () => void;
  match: Match;
}

export const MatchEntry = ({ match, handleMatchChange, isAdding }: Props) => {
  const [ign, setIgn] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load IGN on mount
  useEffect(() => {
    const fetchData = async () => {
      setIgn(await uuidToIGN(match.result.uuid));
      setLoading(false);
    };

    fetchData();
  }, [match.result.uuid]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">{match.id}</p>
            <p>{new Date(match.date * 1000).toLocaleString()}</p>
            <div className="inline-flex items-center space-x-2">
              {ign && (
                <>
                  {match.result.uuid && (
                    <Image
                      alt="avatar"
                      src={uuidToHead(match.result.uuid)}
                      width={20}
                      height={20}
                      unoptimized
                    />
                  )}
                  <span>
                    {ign} - {msToTime(match.result.time)}
                  </span>
                </>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent div's onClick
              handleMatchChange();
            }}
          >
            {isAdding ? <Plus /> : <Minus />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};