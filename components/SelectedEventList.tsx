import { Container } from "@/components/Container";
import { Match } from "@/utils/interfaces/Match";
import { MatchEntry } from "./MatchEntry";
import { updateEventMatchList } from "@/utils/ui/requests";
import { useState } from "react";

interface Props {
  matches: Match[];
  removeMatch: (match: Match) => void
  secret: string
}

export const SelectedEventList = ({ matches, removeMatch, secret }: Props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveChanges = async () => {
    setErrorMessage("")
    setSuccessMessage("")

    const success = await updateEventMatchList(secret, matches)

    if (success) {
      setSuccessMessage("Changes saved successfully")
    } else {
      setErrorMessage("Failed to update, try again later")
    }
  }

  return (
    <Container>
      <h1 className="text-xl font-semibold mb-6 text-center">Selected Matches</h1>

      {successMessage && (
        <div className="text-green-500 text-center mb-4">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 text-center mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        onClick={handleSaveChanges}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save Changes
      </button>

      <div className="max-h-[500px] overflow-y-auto">
        {
          matches.map((match, idx) =>
            <MatchEntry
              key={idx}
              match={match}
              isAdding={false}
              handleMatchChange={() => removeMatch(match)}
            />)
        }
      </div>
    </Container>
  )
}