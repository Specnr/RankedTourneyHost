import { DetailedMatch, Match } from "./Match";

export interface Event {
  _id: string;
  name: string;
  format: string;
  lastUpdated: number;
  matches?: Match[];
}

export interface NamedResults {
  uuid: string;
  nickname: string;
  points?: number;
}

export interface BaseResults {
  name: string;
  results: NamedResults[];
  matchData: DetailedMatch[];
}