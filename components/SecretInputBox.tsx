import { useState } from "react";
import { getEventWithSecret, updateEventDetails } from "@/utils/ui/requests";
import { Event } from "@/utils/interfaces/Event";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  event: Event | null;
  setEvent: (event: Event | null) => void;
  eventSecret: string;
  setEventSecret: (secret: string) => void;
}

// Frontend format validation helper
const validateFormat = (format: string): { isValid: boolean; error?: string } => {
  if (!format.trim()) {
    return { isValid: false, error: "Format cannot be empty" };
  }

  const ops = format.split(";");

  for (const op of ops) {
    const trimmedOp = op.trim();

    if (trimmedOp === "AVG") {
      continue;
    } else if (trimmedOp.startsWith("DROP")) {
      if (!trimmedOp.includes("(") || !trimmedOp.includes(")")) {
        return { isValid: false, error: "DROP format must include parentheses with parameters" };
      }
      const params = trimmedOp.split("(")[1].split(")")[0].split(",");
      if (params.length !== 2) {
        return { isValid: false, error: "DROP requires exactly 2 parameters: high,low" };
      }
      const high = parseInt(params[0]);
      const low = parseInt(params[1]);
      if (isNaN(high) || isNaN(low) || high < 0 || low < 0) {
        return { isValid: false, error: "DROP parameters must be non-negative integers" };
      }
    } else if (trimmedOp.startsWith("POINTS")) {
      if (!trimmedOp.includes("(") || !trimmedOp.includes(")")) {
        return { isValid: false, error: "POINTS format must include parentheses with parameters" };
      }
      const params = trimmedOp.split("(")[1].split(")")[0].split(",");
      if (params.length < 2 || params.length > 3) {
        return { isValid: false, error: "POINTS requires 2-3 parameters: first,last[,max]" };
      }
      const first = parseInt(params[0]);
      const last = parseInt(params[1]);
      const max = params.length === 3 ? parseInt(params[2]) : undefined;
      if (isNaN(first) || isNaN(last) || first < 0 || last < 0) {
        return { isValid: false, error: "POINTS first and last must be non-negative integers" };
      }
      if (max !== undefined && (isNaN(max) || max < 0)) {
        return { isValid: false, error: "POINTS max must be a non-negative integer" };
      }
    } else {
      return { isValid: false, error: `Unknown operation: ${trimmedOp}` };
    }
  }

  return { isValid: true };
};

export const SecretInputBox = ({ event, setEvent, eventSecret, setEventSecret }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editFormat, setEditFormat] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formatError, setFormatError] = useState("");

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

  const handleEdit = () => {
    if (event) {
      setEditName(event.name);
      setEditFormat(event.format);
      setIsEditing(true);
      setSaveMessage("");
      setFormatError("");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage("");
    setFormatError("");
  };

  const handleFormatChange = (value: string) => {
    setEditFormat(value);
    const validation = validateFormat(value);
    setFormatError(validation.error || "");
  };

  const handleSave = async () => {
    if (!event) return;

    // Validate format before saving
    const validation = validateFormat(editFormat);
    if (!validation.isValid) {
      setFormatError(validation.error || "");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setFormatError("");

    try {
      await updateEventDetails(eventSecret, editName, editFormat);

      // Update the local event state with new values
      setEvent({
        ...event,
        name: editName,
        format: editFormat,
        lastUpdated: Date.now()
      });
      setIsEditing(false);
      setSaveMessage("Event updated successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update event. Please try again.";
      setSaveMessage(errorMessage);
    }

    setIsSaving(false);
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Event Details</h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name:</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter event name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Format:</label>
                <Input
                  value={editFormat}
                  onChange={(e) => handleFormatChange(e.target.value)}
                  placeholder="e.g., POINTS(20,1,24) or AVG;DROP(1,1)"
                  className={formatError ? "border-red-500" : ""}
                />
                {formatError && (
                  <p className="text-red-500 text-sm mt-1">{formatError}</p>
                )}
                <p className="text-gray-600 text-sm mt-1">
                  Examples: POINTS(20,1,24), AVG;DROP(1,1), AVG
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !!formatError}
                  className="flex-1"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>Event Name:</strong> {event.name}</p>
              <p><strong>Event Format:</strong> {event.format}</p>
            </div>
          )}

          {saveMessage && (
            <p className={`mt-2 ${saveMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {saveMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};