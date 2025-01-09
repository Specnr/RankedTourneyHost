import { DetailedMatch, Format, Match, PlayerPoints, PlayerResultAggregate } from "./interfaces/Match";
import { getMatchFromId } from "./ui/requests";

export const parseEventFormat = (format: string) => {
  const formatDetails: Format = {
    avg: false,
    drop: { low: -1, high: -1 },
    points: { first: -1, last: -1 }
  }

  const ops = format.split(";")
  for (const op of ops) {
    if (op === "AVG") {
      formatDetails.avg = true
    } else if (op.startsWith("DROP")) {
      const dropOptions = op.split("(")[1].split(")")[0].split(",")
      formatDetails.drop = {
        low: Number.parseInt(dropOptions[0]),
        high: Number.parseInt(dropOptions[1])
      }
    } else if (op.startsWith("POINTS")) {
      const pointsOptions = op.split("(")[1].split(")")[0].split(",")
      formatDetails.points = {
        first: Number.parseInt(pointsOptions[0]),
        last: Number.parseInt(pointsOptions[1])
      }
    } else {
      throw new Error("Unsupported operation")
    }
  }

  return formatDetails
}

export const getDetailedMatches = async (matches: Match[], verbose: boolean) => {
  const detailedMatches: DetailedMatch[] = await Promise.all(matches.map(match => getMatchFromId(match.id)))

  if (verbose) return detailedMatches

  return detailedMatches.map((dm => ({
    id: dm.id,
    date: dm.date,
    result: dm.result,
    players: dm.players,
    completions: dm.completions
  })))
}

// Interpolate points based on start, end, idx and length
export const getPointsForPlaceInRound = (format: Format, idx: number, len: number) => (
  Math.round(format.points.first + ((format.points.last - format.points.first) / (len - 1)) * idx)
)

export const avgPlayerSort = (a: PlayerResultAggregate, b: PlayerResultAggregate) => {
  if (a.numCompletions !== b.numCompletions) {
    return b.numCompletions - a.numCompletions
  }

  const aAvg = a.completionList.reduce((prev, cur) => prev + cur / a.completionList.length)
  const bAvg = b.completionList.reduce((prev, cur) => prev + cur / b.completionList.length)

  return aAvg - bAvg
}

export const defaultPlayerSort = (a: PlayerResultAggregate, b: PlayerResultAggregate) => {
  if (a.numCompletions !== b.numCompletions) {
    return b.numCompletions - a.numCompletions
  }

  if (a.latestRoundPlayed !== b.latestRoundPlayed) {
    return b.latestRoundPlayed - a.latestRoundPlayed
  }

  return a.latestRoundTime - b.latestRoundTime
}

export const calculatePointPlacements = (roundPoints: Map<string, PlayerPoints>, prevRoundPoints?: Map<string, PlayerPoints>) => {
  const sortedPoints = roundPoints.values().toArray().sort((a, b) => b.sumOfPoints - a.sumOfPoints)

  // Hydrate current round's placements
  sortedPoints.forEach((pp, idx) => {
    const placement = pp.placement || idx + 1
    let placementsMoved = 0;
    if (prevRoundPoints) {
      placementsMoved = prevRoundPoints.get(pp.uuid)!.placement! - placement
    }
    roundPoints.set(pp.uuid, { ...pp, placementsMoved, placement })
  })

  return roundPoints
}

export const convertRoundPointsMapToSortedArrays = (allRoundPoints: Map<string, PlayerPoints>[]) => {
  const allRoundPointsArray: PlayerPoints[][] = []
  allRoundPoints.forEach((rp) => {
    allRoundPointsArray.push(
      rp.values().toArray().toSorted((a, b) => a.placement! - b.placement!)
    )
  })

  return allRoundPointsArray
}

export const getAllPlayersFromMatches = (matches: DetailedMatch[]) => {
  const allPlayers = new Set<string>()
  matches.forEach(m => {
    m.players.forEach(p => {
      allPlayers.add(p.uuid)
    })
  })

  return allPlayers
}

export const tabulateResults = async (matches: Match[], format: Format, verbose: boolean) => {
  const detailedMatches = await getDetailedMatches(matches, verbose)
  const playerToPlayerData = new Map<string, PlayerResultAggregate>()
  const allRoundsPoints: Map<string, PlayerPoints>[] = []
  const allPlayers = getAllPlayersFromMatches(detailedMatches)

  const isUsingPoints = format.points.first > 0

  // TODO: Drop completions from matches here

  detailedMatches.forEach((round, i) => {
    const roundPoints = new Map<string, PlayerPoints>()

    round.completions.forEach((result, j) => {
      // Create empty player data
      if (!playerToPlayerData.has(result.uuid)) {
        playerToPlayerData.set(result.uuid, {
          uuid: result.uuid,
          numCompletions: 0,
          latestRoundPlayed: -1,
          latestRoundTime: -1,
          completionList: []
        })
      }

      // Update round point data if needed
      if (isUsingPoints) {
        const prevRoundPoints = i > 0 ? allRoundsPoints[i - 1].get(result.uuid) : null

        const points = getPointsForPlaceInRound(format, j, round.completions.length)
        roundPoints.set(result.uuid, {
          points,
          uuid: result.uuid,
          sumOfPoints: (prevRoundPoints?.sumOfPoints || 0) + points,
        })
      }

      const data = playerToPlayerData.get(result.uuid)!
      data.numCompletions += 1
      data.latestRoundPlayed = i
      data.latestRoundTime = result.time
      if (format.avg) {
        data.completionList.push(result.time)
      }
      playerToPlayerData.set(result.uuid, data)
    })

    if (isUsingPoints) {
      // Push all non-completion players to round points
      allPlayers.forEach((uuid) => {
        if (!roundPoints.has(uuid)) {
          const prevRoundPoints = i > 0 ? allRoundsPoints[i - 1].get(uuid) : null

          roundPoints.set(uuid, {
            points: 0,
            uuid: uuid,
            sumOfPoints: prevRoundPoints?.sumOfPoints || 0,
            placement: round.completions.length + 1
          })
        }
      })

      // Calculate placements up to this round
      allRoundsPoints.push(calculatePointPlacements(roundPoints, i > 0 ? allRoundsPoints[i - 1] : undefined))
    }
  })

  if (isUsingPoints) {
    const allRoundPointsArr = convertRoundPointsMapToSortedArrays(allRoundsPoints)
    return {
      results: allRoundPointsArr[allRoundPointsArr.length - 1],
      matchData: detailedMatches,
      roundPointData: allRoundPointsArr
    }
  }

  // Select sort based on format
  const formatSort = format.avg ? avgPlayerSort : defaultPlayerSort;
  const playerRankings = playerToPlayerData.values().toArray().toSorted(formatSort)

  return {
    results: playerRankings.map((pr) => pr.uuid),
    matchData: detailedMatches
  }
}