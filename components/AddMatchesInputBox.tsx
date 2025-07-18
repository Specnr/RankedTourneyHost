import { useState } from "react";
import { getMatchesFromIGN } from "@/utils/ui/requests";
import { MatchEntry } from "./MatchEntry";
import { Match } from "@/utils/interfaces/Match";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  selectedMatches: Match[];
  addMatch: (match: Match) => void;
}

export const AddMatchesInputBox = ({ selectedMatches, addMatch }: Props) => {
  const [ign, setIgn] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);

  const softUpdate = () => {
    const matchIds = new Set(selectedMatches.map((m) => m.id));
    const filteredMatches: Match[] = matches.filter(
      (item: Match) => !matchIds.has(item.id)
    );

    setMatches(filteredMatches);
  };

  const handleUpdate = async () => {
    if (!ign) {
      setErrorMessage("IGN is required");
      return;
    }

    setErrorMessage(""); // Clear any previous error

    const fetchedMatches = await getMatchesFromIGN(ign);
    if (!fetchedMatches || !Array.isArray(fetchedMatches)) {
      setErrorMessage("Request failed, try again later");
      return;
    }

    const matchIds = new Set(selectedMatches.map((m) => m.id));
    const filteredMatches: Match[] = fetchedMatches.filter(
      (item: Match) => !matchIds.has(item.id) && !!item.result.uuid
    );

    setMatches(filteredMatches);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Enter IGN"
        value={ign}
        onChange={(e) => setIgn(e.target.value)}
      />
      <Button onClick={handleUpdate}>Update</Button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="max-h-[500px] overflow-y-auto">
        {matches.map((match, idx) => (
          <MatchEntry
            isAdding
            match={match}
            key={idx}
            handleMatchChange={() => {
              addMatch(match);
              softUpdate(); // Update the UI without repinging the backend
            }}
          />
        ))}
      </div>
    </div>
  );
};