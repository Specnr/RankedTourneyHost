import { Match } from "../interfaces/Match"

const sendSafeRequest = async (endpoint: string, options?: RequestInit) => {
  try {
    const resp = await fetch(endpoint, options)

    if (!resp.ok) {
      return false
    }

    return await resp.json()
  } catch {
    return false
  }
}

export const updateEventMatchList = async (secret: string, matches: Match[]) => {
  const resp = await sendSafeRequest("/api/events/matches", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ secret, matches })
  })

  return !!resp
}

export const getEventWithSecret = async (secret: string) => {
  const data = await sendSafeRequest("/api/events", {
    headers: {
      'Authorization': `Bearer ${secret}`,
    },
  })

  if (!data || !data.events || !Array.isArray(data.events) || data.events.length === 0) {
    return false
  }

  return data.events[0]
}

export const getEventList = async () => {
  const data = await sendSafeRequest(`${process.env.HOST}/api/events`)

  if (!data || !data.events || !Array.isArray(data.events) || data.events.length === 0) {
    return false
  }

  return data.events
}

export const getResultsFromEventId = async (eventId: string) => {
  const data = await sendSafeRequest(`/api/results?eventId=${eventId}`)

  if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
    return false
  }

  return data
}

export const getMatchesFromIGN = async (ign: string) => {
  const endpoint = `https://mcsrranked.com/api/users/${ign}/matches?count=50&type=3`
  const data = await sendSafeRequest(endpoint, {
    headers: {
      "API-Key": process.env.RANKED_API_KEY || ""
    }
  })

  if (!data || data.status !== "success") {
    return false
  }

  return data.data
}

export const getMatchFromId = async (matchId: number) => {
  const endpoint = `https://mcsrranked.com/api/matches/${matchId}`
  const data = await sendSafeRequest(endpoint, {
    headers: {
      "API-Key": process.env.RANKED_API_KEY || ""
    }
  })

  if (!data || data.status !== "success") {
    return false
  }

  return data.data
}