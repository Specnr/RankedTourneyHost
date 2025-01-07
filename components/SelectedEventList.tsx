import { Container } from "@/components/Container";

interface Props {
  matches: number[];
}

// TODO: Pull in date from match
export const SelectedEventList = ({ matches }: Props) => {
  return (
    <Container>
      <h1 className="text-xl font-semibold mb-6 text-center">Selected Matches</h1>
      {
        matches.map((match, idx) => (
          <p key={idx}>{match} - {(new Date(1736264376 * 1000)).toLocaleString()}</p>
        ))
      }
    </Container>
  )
}