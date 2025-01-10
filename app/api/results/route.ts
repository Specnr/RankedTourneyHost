import { getEventById } from "@/utils/events";
import { parseEventFormat, tabulateResults } from "@/utils/results";
import { Event } from "@/utils/interfaces/Event";
import { ObjectId } from "mongodb";

export const revalidate = 30

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId')
  if (!eventId || !ObjectId.isValid(eventId)) {
    return new Response("Missing Event Id", { status: 400 })
  }

  const event = (await getEventById(new ObjectId(eventId))) as unknown as Event
  if (!event) {
    return new Response("Event not found", { status: 404 })
  }

  let format;
  try {
    format = parseEventFormat(event.format)
  } catch {
    return new Response("Event contains invalid format", { status: 400 })
  }

  const fullResults = await tabulateResults(event.matches || [], format, !!searchParams.get('verbose'))

  return Response.json({ name: event.name, ...fullResults })
}