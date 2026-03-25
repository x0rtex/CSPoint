import { Request, Response } from "express";

import { collections } from "../database";
import { createUserSchema, User } from "../models/user";
import { ObjectId } from "mongodb";
import argon2 from "argon2";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = (await collections.users
      ?.find({})
      .project({ hashedPassword: 0 })
      .toArray()) as unknown as User[];

    res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with getting ${error.message}`);
    } else {
      console.log(`Error with ${error}`);
    }
    res.status(500).send("oops");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  // Get a single user by ID from the database
  const idParam = req.params.id;
  if (Array.isArray(idParam)) {
    return res.status(400).json({ message: "Invalid id parameter" });
  }

  let id: string = idParam;

  try {
    const query = { _id: new ObjectId(id) };

    const user = (await collections.users?.findOne(query, {
      projection: { hashedPassord: 0 },
    })) as unknown as User;

    if (user) {
      res.status(200).send(user);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with getting ${error.message}`);
    } else {
      console.log(`Error with ${error}`);
    }
    res.status(404).send(`Unable to find matching document with id: ${id}`);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, phoneNumber, email, dob, tags, roles } = req.body;
  try {
    const existingUser = await collections.users?.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      res.status(400).json({ error: "Existing email" });
      return;
    }

    const newUser: User = {
      name: name,
      phoneNumber: phoneNumber,
      email: email,
      dob: new Date(dob),
      dateJoined: new Date(),
      lastUpdated: new Date(),
      tags: tags || [],
      roles: roles || [],
    };

    newUser.hashedPassword = await argon2.hash(req.body.password);

    const result = await collections.users?.insertOne(newUser);

    if (result) {
      res
        .status(201)
        .location(`${result.insertedId}`)
        .json({
          message: `Created a new user with id ${result.insertedId}`,
        });
    } else {
      res.status(500).send("Failed to create a new user");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with creating ${error.message}`);
    } else {
      console.log(`Error with ${error}`);
    }
    res.status(400).send(`Unable to create new user`);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues,
    });
  }

  const idParam = req.params.id;
  if (Array.isArray(idParam)) {
    return res.status(400).json({ message: "Invalid id parameter" });
  }

  let id: string = idParam;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.updateOne(query, {
      $set: req.body,
    });
    if (result?.modifiedCount === 1) {
      const updatedUser = await collections.users?.findOne(query);
      res.status(200).send(updatedUser);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with updating ${error.message}`);
    } else {
      console.log(`Error with ${error}`);
    }
    res.status(404).send(`Unable to find matching document with id: ${id}`);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const idParam = req.params.id;
  if (Array.isArray(idParam)) {
    return res.status(400).json({ message: "Invalid id parameter" });
  }

  let id: string = idParam;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.users?.deleteOne(query);
    if (result?.deletedCount === 1) {
      res.status(200).send(`Successfully deleted user with id ${id}`);
    } else {
      res.status(404).send(`User with id ${id} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Issue with deleting ${error.message}`);
    } else {
      console.log(`Error with ${error}`);
    }
    res.status(404).send(`Unable to find matching document with id: ${id}`);
  }
};
