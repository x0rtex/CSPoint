import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(1).max(50),
  country: z.string().min(1).max(50),
  logoUrl: z.url().min(10).max(200),
  ranking: z.number().int().min(1).optional(),
  playerIds: z.array(z.string()).optional(),
});

export const updateTeamSchema = createTeamSchema.partial();
