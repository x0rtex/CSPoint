import { ObjectId } from "mongodb";

export interface Team {
  id?: ObjectId;
  name: string;
  country: string;
  logoUrl: string;
  ranking?: number;
  playerIds?: ObjectId[];
  lastUpdated?: Date;
}
