import { overwriteMatches } from "@/utils/events"
import { Match } from "@/utils/interfaces/Match"

export const revalidate = 10

const MAX_MATCHES_LENGTH = 20

// Overwrite Event matches
export async function PUT(req: Request) {
  const res = await req.json()

  if (!res.secret || !res.matches || !Array.isArray(res.matches) || res.matches.length > MAX_MATCHES_LENGTH) {
    return new Response("Invalid input", { status: 400 })
  }

  for (const match of res.matches as Match[]) {
    if (!match.id || !match.date || !match.result || !match.result.time) {
      return new Response(`Invalid match: ${match}`, { status: 400 })
    }
  }

  // Only save what we need
  const mappedMatches: Match[] = res.matches.map((m: Match) => ({
    id: m.id,
    date: m.date,
    result: m.result
  }))

  const updatRes = await overwriteMatches(res.secret, mappedMatches)
  if (!updatRes) {
    return new Response("Event not found", { status: 404 })
  }

  return Response.json({ success: true })
}