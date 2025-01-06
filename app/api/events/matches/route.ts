import { overwriteMatches } from "@/utils/events"

export const revalidate = 10

// Overwrite Event matches
export async function PUT(req: Request) {
  const res = await req.json()

  if (!res.secret || !res.matches || !Array.isArray(res.matches)) {
    return new Response("Invalid input", { status: 400 })
  }

  const updatRes = await overwriteMatches(res.secret, res.matches)
  if (!updatRes) {
    return new Response("Event not found", { status: 404 })
  }

  return new Response("Success", { status: 200 })
}