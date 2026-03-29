import { Request, Response } from "express";
import { collections } from "../database";

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [users, players, teams, matches, playersByCountry] = await Promise.all([
      collections.users?.countDocuments({}),
      collections.players?.countDocuments({}),
      collections.teams?.countDocuments({}),
      collections.matches?.countDocuments({}),
      collections.players
        ?.aggregate([
          {
            $group: {
              _id: "$country",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 8 },
        ])
        .toArray(),
    ]);

    res.status(200).json({
      users: users || 0,
      players: players || 0,
      teams: teams || 0,
      matches: matches || 0,
      playersByCountry: (playersByCountry || []).map((entry: any) => ({
        country: entry._id || "Unknown",
        count: entry.count || 0,
      })),
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
