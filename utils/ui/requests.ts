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