export interface Result {
  uuid: string
  time: number
}

export interface Match {
  id: number
  date: number
  result: Result
}

export enum RoleType {
  DEFAULT = 0,
  STONE = 1,
  IRON = 2,
  DIAMOND = 3
}

export interface Player {
  uuid: string
  nickname: string
  eloRate: number
  eloRank: number
  roleType: RoleType
}

export interface DetailedMatch extends Match {
  players: Player[]
  completions: Result[]
}

export interface PlayerPoints {
  uuid: string
  time: number
  points: number
  sumOfPoints: number
  placement?: number
  placementsMoved?: number
}

export interface PlayerResultAggregate {
  uuid: string
  numCompletions: number
  latestRoundPlayed: number
  latestRoundTime: number
  completionList: number[]
}

export interface Format {
  avg: boolean
  drop: {
    low: number
    high: number
  }
  points: {
    first: number
    last: number
    max?: number
  }
}