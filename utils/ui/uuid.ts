const DEFAULT_IGN = "N/A"

export const uuidToIGN = async (uuid: string) => {
  if (!uuid) {
    return DEFAULT_IGN
  }

  const endpoint = `https://playerdb.co/api/player/minecraft/${uuid}`
  try {
    const resp = await fetch(endpoint)
    console.log(resp)

    if (!resp.ok) {
      return DEFAULT_IGN
    }

    const data = await resp.json()
    if (!data.success) {
      return DEFAULT_IGN
    }

    return data.data.player.username
  } catch {
    return DEFAULT_IGN
  }
}

export const uuidToHead = (uuid: string) => {
  const endpoint = "https://api.mineatar.io/face/";
  return `${endpoint}${uuid}`;
};