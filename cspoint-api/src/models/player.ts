import { ObjectId } from "mongodb";

export interface Player {
  id?: ObjectId;
  name: string;
  nickname: string;
  country: string;
  photoUrl?: string;
  rating: number;
  teamId?: ObjectId;
  lastUpdated?: Date;
}
