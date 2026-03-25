export interface Team {
  _id?: string;
  name: string;
  country: string;
  logoUrl?: string;
  ranking?: number;
  playerIds?: string[];
  lastUpdated?: Date;
}
