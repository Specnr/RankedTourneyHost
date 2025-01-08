import { getEventById } from "@/utils/events";
import { tabulateResults } from "@/utils/results";
import { ObjectId } from "mongodb";

export const revalidate = 30

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId')
  if (!eventId || !ObjectId.isValid(eventId)) {
    return new Response("Missing Event Id", { status: 400 })
  }

  const event = await getEventById(new ObjectId(eventId))
  if (!event) {
    return new Response("Event not found", { status: 404 })
  }

  const fullResults = await tabulateResults(event.matches || [])

  return Response.json({ ...fullResults })
}