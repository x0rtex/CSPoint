import { Request, Response } from "express";
import { collections } from "../database";
import { Player } from "../models/player";
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { createPlayerSchema, updatePlayerSchema } from "../schemas/player";
import { validateRequest } from "../utils/validate-request";

export const getPlayers = async (
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
      collections.players?.find({}).skip(skip).limit(limit).toArray(),
      collections.players?.countDocuments({}),
    ]);

    res.status(200).json({
      data: (items || []) as unknown as Player[],
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
    res.status(500).send("Failed to get players.");
  }
};

export const getPlayer = async (req: Request, res: Response): Promise<void> => {
  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  try {
    const query = { _id: new ObjectId(id) };
    const player = (await collections.players?.findOne(
      query,
    )) as unknown as Player;
    if (player) {
      res.status(200).send(player);
    } else {
      res.status(404).send(`Player with id ${id} not found`);
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

export const createPlayer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!validateRequest(createPlayerSchema, req, res)) {
    return;
  }

  const { name, nickname, country, photoUrl, rating, teamId } = req.body;

  const newPlayer: Player = {
    name,
    nickname,
    country,
    ...(photoUrl !== undefined && { photoUrl }),
    rating,
    ...(teamId !== undefined && { teamId }),
    lastUpdated: new Date(),
  };

  try {
    const result: InsertOneResult<Player> | undefined = await collections.players?.insertOne(newPlayer);
    if (result) {
      const createdPlayer: WithId<Player> | null | undefined = await collections.players?.findOne({
        _id: result.insertedId,
      });
      res.status(201).location(`${result.insertedId}`).json(createdPlayer);
    } else {
      res.status(500).send("Failed to create a new player.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(`Unable to create new player`);
  }
};

export const updatePlayer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!validateRequest(updatePlayerSchema, req, res)) {
    return;
  }

  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  const { name, nickname, country, photoUrl, rating, teamId } = req.body;
  const updateData: Partial<Player> = {
    ...(name !== undefined && { name }),
    ...(nickname !== undefined && { nickname }),
    ...(country !== undefined && { country }),
    ...(photoUrl !== undefined && { photoUrl }),
    ...(rating !== undefined && { rating }),
    ...(teamId !== undefined && { teamId }),
    lastUpdated: new Date(),
  };

  try {
    const query = { _id: new ObjectId(id) };
    const result: UpdateResult<Player> | undefined = await collections.players?.updateOne(query, {
      $set: updateData,
    });
    if (result?.modifiedCount === 1) {
      const updatedPlayer: WithId<Player> | null | undefined = await collections.players?.findOne(query);
      res.status(200).json(updatedPlayer);
    } else if (result?.matchedCount === 0) {
      res.status(404).send(`Player with id ${id} not found`);
    } else {
      res.status(500).send(`Unable to update player with id ${id}`);
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

export const deletePlayer = async (
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
    const result: DeleteResult | undefined = await collections.players?.deleteOne(query);
    if (result?.deletedCount === 1) {
      res.status(200).send(`Successfully deleted player with id ${id}`);
    } else {
      res.status(404).send(`Player with id ${id} not found`);
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
