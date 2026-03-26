import { Request, Response } from "express";
import { collections } from "../database";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [users, players, teams, matches] = await Promise.all([
      collections.users?.countDocuments({}),
      collections.players?.countDocuments({}),
      collections.teams?.countDocuments({}),
      collections.matches?.countDocuments({}),
    ]);

    res.status(200).json({
      users: users || 0,
      players: players || 0,
      teams: teams || 0,
      matches: matches || 0,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with stats ${error.message}`);
    } else {
      console.log(`Error with ${error}`);
    }
    res.status(500).json({ message: "Failed to load stats" });
  }
};
