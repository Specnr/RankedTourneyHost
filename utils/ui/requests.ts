const sendSafeRequest = async (endpoint: string, options: RequestInit) => {
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