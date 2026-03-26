export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  favouriteTeamId?: string;
  favouritePlayerId?: string;
  roles?: string[];
  dateJoined?: Date;
  lastUpdated?: Date;
}
