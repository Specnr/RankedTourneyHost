import { useState } from "react";
import { getEventWithSecret } from "@/utils/ui/requests";
import { Event } from "@/utils/interfaces/Event";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  event: Event | null;
  setEvent: (event: Event | null) => void;
  eventSecret: string;
  setEventSecret: (secret: string) => void;
}

export const SecretInputBox = ({ event, setEvent, eventSecret, setEventSecret }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setEvent(null);
    if (!eventSecret) {
      setErrorMessage("Event Secret is required");
      return;
    }

    setErrorMessage(""); // Clear any previous error

    const fetchedEvent = await getEventWithSecret(eventSecret);

    if (!fetchedEvent) {
      setErrorMessage("Event not found");
    } else {
      setEvent(fetchedEvent);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Enter your event secret"
        value={eventSecret}
        onChange={(e) => setEventSecret(e.target.value)}
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {event && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Event Details</h2>
          <p><strong>Event Name:</strong> {event.name}</p>
          <p><strong>Event Format:</strong> {event.format}</p>
        </div>
      )}
    </div>
  );
};