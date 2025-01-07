import { useState } from "react";

import { Container } from "@/components/Container";

import { getEventWithSecret } from "@/utils/ui/requests";
import { Event } from "@/utils/interfaces/Event";

interface Props {
  event: Event | null
  setEvent: (event: Event | null) => void;
  eventSecret: string
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
    <Container>
      <h1 className="text-2xl font-semibold mb-6 text-center">RTH Admin Portal</h1>
      <div className="mb-4">
        <label htmlFor="eventSecret" className="block text-sm font-medium mb-2">
          Event Secret
        </label>
        <input
          type="text"
          id="eventSecret"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your event secret"
          value={eventSecret}
          onChange={(e) => setEventSecret(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-center mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>

      {event && (
        <div className="mt-6 text-center text-white">
          <h2 className="text-xl">Event Details</h2>
          <p><strong>Event ID:</strong> {event._id}</p>
          <p><strong>Event Name:</strong> {event.name}</p>
        </div>
      )}
    </Container>
  )
}