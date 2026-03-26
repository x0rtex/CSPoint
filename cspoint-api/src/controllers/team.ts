import { Request, Response } from "express";
import { collections } from "../database";
import { Team } from "../models/team";
import { DeleteResult, ObjectId, UpdateResult, WithId } from "mongodb";
import { createTeamSchema, updateTeamSchema } from "../schemas/team";
import { validateRequest } from "../utils/validate-request";

export const getTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt((req.query.limit as string) || "10", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      collections.teams?.find({}).skip(skip).limit(limit).toArray(),
      collections.teams?.countDocuments({}),
    ]);

    res.status(200).json({
      data: (items || []) as unknown as Team[],
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
    res.status(500).send("Failed to get teams.");
  }
};

export const getTeam = async (req: Request, res: Response): Promise<void> => {
  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  try {
    const query = { _id: new ObjectId(id) };
    const team = (await collections.teams?.findOne(query)) as unknown as Team;
    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).send(`Team with id ${id} not found`);
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

export const createTeam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!validateRequest(createTeamSchema, req, res)) {
    return;
  }

  const { name, country, logoUrl, ranking, playerIds } = req.body;

  const newTeam: Team = {
    name,
    country,
    logoUrl,
    ...(ranking !== undefined && { ranking }),
    ...(playerIds !== undefined && { playerIds }),
    lastUpdated: new Date(),
  };

  try {
    const result = await collections.teams?.insertOne(newTeam);
    if (result) {
      const createdTeam = await collections.teams?.findOne({
        _id: result.insertedId,
      });
      res.status(201) .location(`${result.insertedId}`).json(createdTeam);
    } else {
      res.status(500).send("Failed to create a new team.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(`Unable to create new team`);
  }
};

export const updateTeam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!validateRequest(updateTeamSchema, req, res)) {
    return;
  }

  const idParam = req.params.id;
  if (Array.isArray(idParam) || !ObjectId.isValid(idParam)) {
    res.status(400).json({ message: "Invalid id parameter" });
    return;
  }

  let id: string = idParam;

  const { name, country, logoUrl, ranking, playerIds } = req.body;
  const updateData: Partial<Team> = {
    lastUpdated: new Date(),
    ...(name !== undefined && { name }),
    ...(country !== undefined && { country }),
    ...(logoUrl !== undefined && { logoUrl }),
    ...(ranking !== undefined && { ranking }),
    ...(playerIds !== undefined && { playerIds }),
  };

  try {
    const query = { _id: new ObjectId(id) };
    const result: UpdateResult<Team> | undefined = await collections.teams?.updateOne(query, {
      $set: updateData,
    });
    if (result?.modifiedCount === 1) {
      const updatedTeam: WithId<Team> | null | undefined = await collections.teams?.findOne(query);
      res.status(200).json(updatedTeam);
    } else if (result?.matchedCount === 0) {
      res.status(404).send(`Team with id ${id} not found`);
    } else {
      res.status(500).send(`Unable to update team with id ${id}`);
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

export const deleteTeam = async (
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
    const result: DeleteResult | undefined = await collections.teams?.deleteOne(query);
    if (result?.deletedCount === 1) {
      res.status(200).send(`Successfully deleted team with id ${id}`);
    } else {
      res.status(404).send(`Team with id ${id} not found`);
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
