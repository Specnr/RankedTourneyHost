import { DetailedMatch, Match, PlayerResultAggregate } from "./interfaces/Match";
import { getMatchFromId } from "./ui/requests";

export const tabulateResults = async (matches: Match[]) => {
  const detailedMatches: DetailedMatch[] = await Promise.all(matches.map(match => getMatchFromId(match.id)))

  const cleanedMatches = detailedMatches.map((dm => ({
    id: dm.id,
    date: dm.date,
    result: dm.result,
    players: dm.players,
    completions: dm.completions
  })))

  const playerToPlayerData = new Map<string, PlayerResultAggregate>()

  cleanedMatches.forEach((round, i) => {
    round.completions.forEach((result) => {
      // Create empty player data
      if (!playerToPlayerData.has(result.uuid)) {
        playerToPlayerData.set(result.uuid, {
          uuid: result.uuid,
          numCompletions: 0,
          latestRoundPlayed: -1,
          latestRoundTime: -1
        })
      }

      const data = playerToPlayerData.get(result.uuid)!
      data.numCompletions += 1
      data.latestRoundPlayed = i
      data.latestRoundTime = result.time
      playerToPlayerData.set(result.uuid, data)
    })
  })

  const playerRankings = playerToPlayerData.values().toArray().toSorted((a, b) => {
    if (a.numCompletions !== b.numCompletions) {
      return b.numCompletions - a.numCompletions
    }

    if (a.latestRoundPlayed !== b.latestRoundPlayed) {
      return b.latestRoundPlayed - a.latestRoundPlayed
    }

    return a.latestRoundTime - b.latestRoundTime
  })

  return {
    results: playerRankings.map((pr) => pr.uuid),
    matchData: cleanedMatches
  }
}