"use client"
import React, { useState } from "react";

import { SecretInputBox } from "@/components/SecretInputBox";

import { Event } from "@/utils/interfaces/Event";
import { SelectedEventList } from "@/components/SelectedEventList";
import { AddMatchesInputBox } from "@/components/AddMatchesInputBox";

const Page = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventSecret, setEventSecret] = useState("");

  const matches = event ? event.matches || [] : []
  const matchIds = new Set(matches.map((m) => m.id))

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
      <div className="col-start-2 col-span-2">
        <SelectedEventList matches={matches} />
      </div>
      <div className="col-start-4 col-span-2">
        <AddMatchesInputBox selectedMatches={matchIds} />
      </div>
    </div>
  );
};

export default Page;

