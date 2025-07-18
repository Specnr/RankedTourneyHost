'use client'
import React, { useState } from "react";
import { SecretInputBox } from "@/components/SecretInputBox";
import { Event } from "@/utils/interfaces/Event";
import { SelectedEventList } from "@/components/SelectedEventList";
import { AddMatchesInputBox } from "@/components/AddMatchesInputBox";
import { Match } from "@/utils/interfaces/Match";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [eventSecret, setEventSecret] = useState("");

  const matches = event ? event.matches || [] : [];

  const handleUpdateMatches = (newMatch: Match) => {
    let idx = -1;
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].id === newMatch.id) {
        idx = i;
        break;
      }
    }

    if (idx === -1) {
      matches.push(newMatch);
      matches.sort((a, b) => a.date - b.date);
    } else {
      matches.splice(idx, 1);
    }

    setEvent({ ...event!, matches });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4 max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Event Secret</CardTitle>
        </CardHeader>
        <CardContent>
          <SecretInputBox
            event={event}
            setEvent={setEvent}
            eventSecret={eventSecret}
            setEventSecret={setEventSecret}
          />
        </CardContent>
      </Card>
      {event && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Selected Event</CardTitle>
            </CardHeader>
            <CardContent>
              <SelectedEventList
                matches={matches}
                removeMatch={handleUpdateMatches}
                secret={eventSecret}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Add Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <AddMatchesInputBox
                selectedMatches={matches}
                addMatch={handleUpdateMatches}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Page;

