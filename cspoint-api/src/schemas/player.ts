import { z } from "zod";

export const createPlayerSchema = z.object({
  name: z.string().min(3).max(50),
  nickname: z.string().min(2).max(50),
  country: z.string().min(3).max(50),
  photoUrl: z.url().min(10).max(200).optional(),
  rating: z.number().min(0).max(3),
  teamId: z.string().optional(),
});

export const updatePlayerSchema = createPlayerSchema.partial();
