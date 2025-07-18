import { Match } from "@/utils/interfaces/Match";
import { MatchEntry } from "./MatchEntry";
import { updateEventMatchList } from "@/utils/ui/requests";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  matches: Match[];
  removeMatch: (match: Match) => void;
  secret: string;
}

export const SelectedEventList = ({ matches, removeMatch, secret }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveChanges = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const success = await updateEventMatchList(secret, matches);

    if (success) {
      setSuccessMessage("Changes saved successfully");
    } else {
      setErrorMessage("Failed to update, try again later");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleSaveChanges}>Save Changes</Button>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="max-h-[500px] overflow-y-auto">
        {matches.map((match, idx) => (
          <MatchEntry
            key={idx}
            match={match}
            isAdding={false}
            handleMatchChange={() => removeMatch(match)}
          />
        ))}
      </div>
    </div>
  );
};