import { Match } from "../interfaces/Match"

const sendSafeRequest = async (endpoint: string, options?: RequestInit) => {
  try {
    const resp = await fetch(endpoint, options)

    if (!resp.ok) {
      const errorText = await resp.text()
      throw new Error(errorText || `HTTP ${resp.status}: ${resp.statusText}`)
    }

    return await resp.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Network error occurred")
  }
}

export const updateEventMatchList = async (secret: string, matches: Match[]) => {
  try {
    const resp = await sendSafeRequest("/api/events/matches", {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret, matches })
    })

    return !!resp
  } catch {
    return false
  }
}

export const getEventWithSecret = async (secret: string) => {
  try {
    const data = await sendSafeRequest("/api/events", {
      headers: {
        'Authorization': `Bearer ${secret}`,
      },
    })

    if (!data || !data.events || !Array.isArray(data.events) || data.events.length === 0) {
      return false
    }

    return data.events[0]
  } catch {
    return false
  }
}

export const updateEventDetails = async (secret: string, name?: string, format?: string) => {
  const body: { secret: string; event?: string; format?: string } = { secret };
  if (name !== undefined) body.event = name;
  if (format !== undefined) body.format = format;

  const resp = await sendSafeRequest("/api/events", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  })

  if (!resp) {
    throw new Error("Failed to update event. Please try again.");
  }

  return true;
}

export const getEventList = async () => {
  try {
    const data = await sendSafeRequest(`${process.env.HOST}/api/events`)

    if (!data || !data.events || !Array.isArray(data.events) || data.events.length === 0) {
      return []
    }

    return data.events
  } catch {
    return []
  }
}

export const getResultsFromEventId = async (eventId: string) => {
  try {
    const data = await sendSafeRequest(`/api/results?eventId=${eventId}`)

    if (!data || !data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return null
    }

    return data
  } catch {
    return null
  }
}

export const getMatchesFromIGN = async (ign: string) => {
  try {
    const endpoint = `https://mcsrranked.com/api/users/${ign}/matches?count=50&type=3`
    const data = await sendSafeRequest(endpoint, {
      headers: {
        "API-Key": process.env.RANKED_API_KEY || ""
      }
    })

    if (!data || data.status !== "success") {
      return null
    }

    return data.data
  } catch {
    return null
  }
}

export const getMatchFromId = async (matchId: number) => {
  try {
    const endpoint = `https://mcsrranked.com/api/matches/${matchId}`
    const data = await sendSafeRequest(endpoint, {
      headers: {
        "API-Key": process.env.RANKED_API_KEY || ""
      }
    })

    if (!data || data.status !== "success") {
      return null
    }

    return data.data
  } catch {
    return null
  }
}