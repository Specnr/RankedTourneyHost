import { eventExists, getEventBySecret, getEventList, upsertEvent } from "@/utils/events"

export const revalidate = 10

// Get Event(s)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const count = searchParams.get('count') || ""
    const events = await getEventList(Number.parseInt(count) || undefined)
    return Response.json({ events })
  }

  const secret = authHeader.split(" ")[1]
  const event = await getEventBySecret(secret)
  if (!event) {
    return new Response("Event not found", { status: 404 })
  }
  return Response.json({ events: [event] })
}

// Create Event
export async function POST(req: Request) {
  const res = await req.json()

  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Auth key required", { status: 401 })
  }

  const authKey = authHeader.split(" ")[1]
  if (authKey !== process.env.ADMIN_KEY) {
    return new Response("Invalid auth key", { status: 401 })
  }

  if (!res.event || !res.format) {
    return new Response("Invalid input", { status: 400 })
  }

  const secret = await upsertEvent(res.event, res.format)
  if (secret == null) {
    return new Response("Failed to create event", { status: 400 })
  }

  return Response.json({ secret })
}

// Update Event
export async function PUT(req: Request) {
  const res = await req.json()

  if (!res.event || !res.format || !res.secret) {
    return new Response("Invalid input", { status: 400 })
  }

  if (!(await eventExists(res.secret))) {
    return new Response("Event not found", { status: 404 })
  }

  const secret = await upsertEvent(res.event, res.format, res.secret)
  if (secret == null) {
    return new Response("Failed to update event", { status: 400 })
  }

  return Response.json({ secret })
}