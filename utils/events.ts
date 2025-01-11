import { MongoClient, ObjectId } from "mongodb";
import { omitBy, isNil } from 'lodash';

import randomstring from "randomstring";
import { Match } from "./interfaces/Match";

const db = new MongoClient(process.env.MONGO_URI ?? "").db();
const EventsCol = db.collection("Events")
const DEFAULT_PAGE_SIZE = 20

export const upsertEvent = async (name: string, format: string, givenSecret?: string) => {
  const secret = givenSecret ?? randomstring.generate()
  const res = await EventsCol.updateOne(
    { secret },
    { $set: omitBy({ name, format, lastUpdated: Date.now() }, isNil) },
    { upsert: true }
  )
  return res.acknowledged ? secret : null;
}

export const overwriteMatches = async (secret: string, matches: Match[]) => {
  const sortedMatches = matches.sort((a, b) => a.date - b.date)

  const res = await EventsCol.updateOne(
    { secret },
    { $set: { ["matches"]: sortedMatches, lastUpdated: Date.now() } }
  )

  return res.matchedCount > 0
}

export const getEventBySecret = async (secret: string) =>
  await EventsCol.findOne({ secret }, { projection: { secret: 0 } })

export const getEventById = async (id: ObjectId) =>
  await EventsCol.findOne({ _id: id }, { projection: { secret: 0 } })

export const getEventList = async (size: number = DEFAULT_PAGE_SIZE) =>
  await EventsCol
    .find({}, { projection: { secret: 0 } })
    .sort({ lastUpdated: -1 })
    .limit(size)
    .toArray()

export const eventExists = async (secret: string) => {
  const res = await getEventBySecret(secret)
  return res != null
}