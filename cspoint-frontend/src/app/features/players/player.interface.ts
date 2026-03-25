export interface Player {
  _id?: string;
  name: string;
  nickname: string;
  country: string;
  photoUrl?: string;
  rating: number;
  teamId?: string;
  lastUpdated?: Date;
}
