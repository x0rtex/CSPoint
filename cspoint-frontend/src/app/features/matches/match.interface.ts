export interface Match {
  _id?: string;
  team1Id: string;
  team2Id: string;
  team1Score: number;
  team2Score: number;
  map: string;
  date: Date;
  lastUpdated?: Date;
}
