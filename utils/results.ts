import { DetailedMatch, Format, Match, PlayerPoints, PlayerResultAggregate } from "./interfaces/Match";
import { getMatchFromId } from "./ui/requests";

export const parseEventFormat = (formatStr: string) => {
  const format: Format = {
    avg: false,
    drop: { low: -1, high: -1 },
    points: { first: -1, last: -1 }
  }

  const ops = formatStr.split(";")
  for (const op of ops) {
    if (op === "AVG") {
      format.avg = true
    } else if (op.startsWith("DROP")) {
      const dropOptions = op.split("(")[1].split(")")[0].split(",")
      format.drop = {
        low: Number.parseInt(dropOptions[0]),
        high: Number.parseInt(dropOptions[1])
      }
    } else if (op.startsWith("POINTS")) {
      const pointsOptions = op.split("(")[1].split(")")[0].split(",")
      format.points = {
        first: Number.parseInt(pointsOptions[0]),
        last: Number.parseInt(pointsOptions[1]),
        max: pointsOptions.length === 3 ? Number.parseInt(pointsOptions[2]) : undefined,
      }
    } else {
      throw new Error("Unsupported operation")
    }
  }

  // Points and drop / avg are mutually exclusive
  if (format.points.first > 0 && (format.avg || format.drop.high > 0 || format.drop.low > 0)) {
    throw new Error("Unsupported combination")
  }

  // Cant use drop without average
  if ((format.drop.high > 0 || format.drop.low > 0) && !format.avg) {
    throw new Error("Unsupported combination")
  }

  return format
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
  Math.round(format.points.first + ((format.points.last - format.points.first) / (Math.max(len - 1, 1))) * idx)
)

export const avgPlayerSort = (a: PlayerResultAggregate, b: PlayerResultAggregate) => {
  if (a.numCompletions !== b.numCompletions) {
    return b.numCompletions - a.numCompletions
  }

  // If one is 0 the other will be too since numCompletions is equal
  if (a.completionList.length === 0 && b.completionList.length === 0) {
    return 0
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

export const dropCompletionsBasedOnFormat = (playerToPlayerData: Map<string, PlayerResultAggregate>, format: Format, matchCount: number) => {
  // Skip if total drop >= than the rounds played
  if (format.drop.high + format.drop.low >= matchCount) {
    return
  }

  playerToPlayerData.keys().forEach(uuid => {
    const playerData = playerToPlayerData.get(uuid)!
    const dnfs = matchCount - playerData.completionList.length
    // Could do some min/max heap shit here if length was big
    playerData.completionList.sort()

    for (let i = 0; i < (format.drop.low - dnfs); i++) {
      playerData.completionList.pop()
    }

    for (let i = 0; i < format.drop.high; i++) {
      playerData.completionList.splice(0, 1)
    }

    playerToPlayerData.set(uuid, playerData)
  })
}

export const sortRoundsBasedOnFinalPoints = (playerPoints: PlayerPoints[][], resultOrder: string[]) => {
  // Make a uuid to order map
  const orderMap = new Map<string, number>()
  resultOrder.forEach((uuid, idx) => orderMap.set(uuid, idx))

  playerPoints.forEach(pp => pp.sort((a, b) => orderMap.get(a.uuid)! - orderMap.get(b.uuid)!))

  return playerPoints
}

export const sortRoundsBasedOnFinalTimes = (detailedMatches: DetailedMatch[], resultOrder: string[]) => {
  // Make a uuid to order map
  const orderMap = new Map<string, number>()
  resultOrder.forEach((uuid, idx) => orderMap.set(uuid, idx))

  detailedMatches.forEach(dm => dm.completions.sort((a, b) => orderMap.get(a.uuid)! - orderMap.get(b.uuid)!))

  return detailedMatches
}

export const tabulateResults = async (matches: Match[], format: Format, verbose: boolean) => {
  const detailedMatches = await getDetailedMatches(matches, verbose)
  const playerToPlayerData = new Map<string, PlayerResultAggregate>()
  const allRoundsPoints: Map<string, PlayerPoints>[] = []
  const allPlayers = getAllPlayersFromMatches(detailedMatches)

  const isUsingPoints = format.points.first > 0
  const isDropping = format.drop.high > 0 || format.drop.low > 0

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

        // Uses max completions if defined and smaller than player count, otherwise player count
        const points = getPointsForPlaceInRound(format, j, Math.min(format.points.max || Infinity, round.players.length))
        roundPoints.set(result.uuid, {
          time: result.time,
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
            time: -1,
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

  if (isDropping) {
    dropCompletionsBasedOnFormat(playerToPlayerData, format, detailedMatches.length)
  }

  if (isUsingPoints) {
    const allRoundPointsArr = convertRoundPointsMapToSortedArrays(allRoundsPoints)
    const results = allRoundPointsArr[allRoundPointsArr.length - 1]
      .map((pp) => ({ uuid: pp.uuid, points: pp.sumOfPoints }))
      .sort((a, b) => b.points - a.points)
    return {
      results,
      matchData: sortRoundsBasedOnFinalPoints(allRoundPointsArr, results.map(r => r.uuid))
    }
  }

  // Select sort based on format
  const formatSort = format.avg ? avgPlayerSort : defaultPlayerSort;
  const playerRankings = playerToPlayerData.values().toArray().toSorted(formatSort)
  const results = playerRankings.map((pr) => ({ uuid: pr.uuid }))

  return {
    results,
    matchData: sortRoundsBasedOnFinalTimes(detailedMatches, results.map(r => r.uuid)).map(dm => dm.completions)
  }
}