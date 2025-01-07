export const getEventWithSecret = async (secret: string) => {
  try {
    const resp = await fetch("/api/events", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${secret}`,
      },
    })

    if (!resp.ok) {
      return false
    }

    const events = (await resp.json()).events
    if (!events || !Array.isArray(events) || events.length === 0) {
      return false
    }
    return events[0]
  } catch {
    return false
  }
}

export const getMatchesFromIGN = async (ign: string) => {
  const endpoint = `https://mcsrranked.com/api/users/${ign}/matches?count=50&type=3`
  try {
    const resp = await fetch(endpoint)

    if (!resp.ok) {
      return false
    }

    const data = await resp.json()
    if (data.status !== "success") {
      return false
    }

    return data.data
  } catch {
    return false
  }
}