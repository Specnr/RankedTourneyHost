export interface Event {
  _id: string;
  name: string;
  format: string;
  lastUpdated: number;
  matches?: number[];
}