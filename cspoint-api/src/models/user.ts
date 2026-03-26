import { ObjectId } from "mongodb";

export interface User {
  id?: ObjectId;
  username: string;
  phoneNumber: string;
  email: string;
  dob?: Date;
  dateJoined?: Date;
  lastUpdated?: Date;
  roles?: string[];
  password?: string;
}
