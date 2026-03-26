import { Request, Response } from "express";
import { collections } from "../database";
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from "mongodb";
import { createMatchSchema, updateMatchSchema } from "../schemas/match";
import { Match } from "../models/match";
import { validateRequest } from "../utils/validate-request";

export const getMatches = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt((req.query.limit as string) || "10", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      collections.matches?.find({}).skip(skip).limit(limit).toArray(),
      collections.matches?.countDocuments({}),
    ]);

    res.status(200).json({
      data: (items || []) as unknown as Match[],
      page,
      pageSize: limit,
      total: total || 0,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with getting ${error.message}`);
    } else {
      console.error(`Error with ${error}`);
    }
    res.status(500).send("Failed to get matches.");
  }
};

export const getMatch = async (req: Request, res: Response): Promise<void> => {
  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  try {
    const query = { _id: new ObjectId(id) };
    const match = (await collections.matches?.findOne(
      query,
    )) as unknown as Match;
    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404).send(`Match with id ${id} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with getting ${error.message}`);
    } else {
      console.error(`Error with ${error}`);
    }
    res.status(500).send(`Server error occurred.`);
  }
};

export const createMatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!validateRequest(createMatchSchema, req, res)) {
    return;
  }

  const { team1Id, team2Id, team1Score, team2Score, map, date } = req.body;

  const newMatch: Match = {
    team1Id,
    team2Id,
    team1Score,
    team2Score,
    map,
    date,
    lastUpdated: new Date(),
  };

  try {
    const result: InsertOneResult<Match> | undefined =
      await collections.matches?.insertOne(newMatch);
    if (result) {
      const createdMatch: WithId<Match> | null | undefined =
        await collections.matches?.findOne({
          _id: result.insertedId,
        });
      res.status(201).location(`${result.insertedId}`).json(createdMatch);
    } else {
      res.status(500).send("Failed to create a new match.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(`Unable to create new match`);
  }
};

export const updateMatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!validateRequest(updateMatchSchema, req, res)) {
    return;
  }

  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  const { team1Id, team2Id, team1Score, team2Score, map, date } = req.body;
  const updateData: Partial<Match> = {
    lastUpdated: new Date(),
    ...(team1Id !== undefined && { team1Id }),
    ...(team2Id !== undefined && { team2Id }),
    ...(team1Score !== undefined && { team1Score }),
    ...(team2Score !== undefined && { team2Score }),
    ...(map !== undefined && { map }),
    ...(date !== undefined && { date }),
  };

  try {
    const query = { _id: new ObjectId(id) };
    const result: UpdateResult<Match> | undefined =
      await collections.matches?.updateOne(query, {
        $set: updateData,
      });
    if (result?.modifiedCount === 1) {
      const updatedMatch: WithId<Match> | null | undefined =
        await collections.matches?.findOne(query);
      res.status(200).json(updatedMatch);
    } else if (result?.matchedCount === 0) {
      res.status(404).send(`Match with id ${id} not found`);
    } else {
      res.status(500).send(`Unable to update match with id ${id}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with updating ${error.message}`);
    } else {
      console.error(`Error with ${error}`);
    }
    res.status(500).send(`Server error occurred.`);
  }
};

export const deleteMatch = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  try {
    const query = { _id: new ObjectId(id) };
    const result: DeleteResult | undefined =
      await collections.matches?.deleteOne(query);
    if (result?.deletedCount === 1) {
      res.status(200).send(`Successfully deleted match with id ${id}`);
    } else {
      res.status(404).send(`Match with id ${id} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Issue with deleting ${error.message}`);
    } else {
      console.error(`Error with ${error}`);
    }
    res.status(500).send(`Server error occurred.`);
  }
};
