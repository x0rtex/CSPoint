import { ObjectId } from "mongodb";

export interface Match {
  id?: ObjectId;
  team1Id: ObjectId;
  team2Id: ObjectId;
  team1Score: number;
  team2Score: number;
  map: string;
  date: Date;
  lastUpdated?: Date;
}
