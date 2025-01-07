import { Container } from "@/components/Container";
import { Match } from "@/utils/interfaces/Match";
import { MatchEntry } from "./MatchEntry";

interface Props {
  matches: Match[];
}

export const SelectedEventList = ({ matches }: Props) => {
  return (
    <Container>
      <h1 className="text-xl font-semibold mb-6 text-center">Selected Matches</h1>
      {
        matches.map((match, idx) => <MatchEntry key={idx} match={match} />)
      }
    </Container>
  )
}