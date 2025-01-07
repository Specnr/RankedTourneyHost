import { overwriteMatches } from "@/utils/events"

export const revalidate = 10

const MAX_MATCHES_LENGTH = 20

// Overwrite Event matches
export async function PUT(req: Request) {
  const res = await req.json()

  if (!res.secret || !res.matches || !Array.isArray(res.matches) || res.matches.length > MAX_MATCHES_LENGTH) {
    return new Response("Invalid input", { status: 400 })
  }

  const updatRes = await overwriteMatches(res.secret, res.matches)
  if (!updatRes) {
    return new Response("Event not found", { status: 404 })
  }

  return new Response("Success", { status: 200 })
}