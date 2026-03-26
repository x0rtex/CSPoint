import { z } from "zod";

export const createMatchSchema = z.object({
  team1Id: z.string(),
  team2Id: z.string(),
  team1Score: z.number().int().min(0).max(40),
  team2Score: z.number().int().min(0).max(40),
  map: z.string().min(1).max(50),
  date: z.coerce.date(),
});

export const updateMatchSchema = createMatchSchema.partial();
