"use client"
import React, { useState } from "react";

import { SecretInputBox } from "@/components/SecretInputBox";

import { Event } from "@/utils/interfaces/Event";

const Page = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventSecret, setEventSecret] = useState("");

  return (
    <SecretInputBox
      event={event}
      setEvent={setEvent}
      eventSecret={eventSecret}
      setEventSecret={setEventSecret}
    />
  );
};

export default Page;

