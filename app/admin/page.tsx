"use client"
import React, { useState } from "react";

import { SecretInputBox } from "@/components/SecretInputBox";

import { Event } from "@/utils/interfaces/Event";
import { SelectedEventList } from "@/components/SelectedEventList";
import { AddMatchesInputBox } from "@/components/AddMatchesInputBox";
import { Match } from "@/utils/interfaces/Match";

const Page = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventSecret, setEventSecret] = useState("");

  const matches = event ? event.matches || [] : []

  const handleUpdateMatches = (newMatch: Match) => {
    let idx = -1
    for (let i=0; i < matches.length; i++) {
      if (matches[i].id === newMatch.id) {
        idx = i
        break
      }
    }

    if (idx === -1) {
      matches.push(newMatch)
      matches.sort((a, b) => a.date - b.date)
    } else {
      matches.splice(idx, 1)
    }

    setEvent({ ...event!, matches })
  }

  return (
    <div className="w-full grid grid-cols-6 gap-4">
      <div className="col-start-2 col-span-4">
        <SecretInputBox
          event={event}
          setEvent={setEvent}
          eventSecret={eventSecret}
          setEventSecret={setEventSecret}
        />
      </div>
      {
        event && (
          <>
            <div className="col-start-2 col-span-2">
              <SelectedEventList matches={matches} removeMatch={handleUpdateMatches} secret={eventSecret} />
            </div>
            <div className="col-start-4 col-span-2">
              <AddMatchesInputBox selectedMatches={matches} addMatch={handleUpdateMatches} />
            </div>
          </>
        )
      }
    </div>
  );
};

export default Page;

