import { useState } from "react"

import { Container } from "@/components/Container"
import { getMatchesFromIGN } from "@/utils/ui/requests";
import { MatchEntry } from "./MatchEntry";
import { Match } from "@/utils/interfaces/Match"

interface Props {
  selectedMatches: Set<number>
}

export const AddMatchesInputBox = ({ selectedMatches }: Props) => {
  const [ign, setIgn] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [matches, setMatches] = useState<Match[]>([])

  const handleUpdate = async () => {
    if (!ign) {
      setErrorMessage("IGN is required");
      return;
    }

    setErrorMessage(""); // Clear any previous error

    const fetchedMatches = await getMatchesFromIGN(ign)
    if (!fetchedMatches || !Array.isArray(fetchedMatches)) {
      setErrorMessage("Request failed, try again later");
      return;
    }

    const filteredMatches: Match[] = fetchedMatches.filter(
      (item: Match) => !selectedMatches.has(item.id)
    )

    setMatches(filteredMatches)
  }

  return (
    <Container>
      <h1 className="text-xl font-semibold mb-6 text-center">Add Matches</h1>
      <div className="mb-4">
        <label htmlFor="eventSecret" className="block text-sm font-medium mb-2">
          Private Room Host IGN
        </label>
        <input
          type="text"
          id="eventSecret"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter IGN"
          value={ign}
          onChange={(e) => setIgn(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div className="text-red-500 text-center mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        onClick={handleUpdate}
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Update
      </button>
      <div className="max-h-[300px] overflow-y-auto">
        {matches.map((match, idx) => (
          <MatchEntry match={match} key={idx} />
        ))}
      </div>
    </Container>
  )
}