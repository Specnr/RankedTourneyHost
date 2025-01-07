"use client"
import React, { useState } from "react";

import { SecretInputBox } from "@/components/SecretInputBox";

import { Event } from "@/utils/interfaces/Event";
import { SelectedEventList } from "@/components/SelectedEventList";
import { AddMatchesInputBox } from "@/components/AddMatchesInputBox";

const Page = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventSecret, setEventSecret] = useState("");

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
        <SelectedEventList matches={event ? event.matches || [] : []} />
      </div>
      <div className="col-start-4 col-span-2">
        <AddMatchesInputBox />
      </div>
    </div>
  );
};

export default Page;

