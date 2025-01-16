import { DetailedMatch, Match, PlayerPoints } from "./Match";

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
  roundPointData?: PlayerPoints[][];
}

export enum PageType {
  Simple = 1,
  Detailed = 2,
  PerRound = 3,
}