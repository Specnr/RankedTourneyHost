import { DetailedMatch, Match, PlayerPoints } from "./Match";

export interface Event {
  _id: string;
  name: string;
  format: string;
  lastUpdated: number;
  matches?: Match[];
}

export interface BaseResults {
  name: string;
  results: unknown[];
  matchData: DetailedMatch[];
}

export interface TimeResults extends BaseResults {
  results: string[]
}

export interface PointResults extends BaseResults {
  results: PlayerPoints[];
  roundPointData?: PlayerPoints[][]
}