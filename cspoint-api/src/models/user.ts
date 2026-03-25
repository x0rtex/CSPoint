import Joi from "joi";
import { ObjectId } from "mongodb";

import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1).max(30),
  email: z.email().min(5),
  dob: z.coerce.date(),
  phoneNumber: z.string().min(10).max(10).startsWith("0"),
  tags: z.array(z.string()).optional(),
  roles: z
    .array(z.object({ name: z.string(), assignedDate: z.coerce.date() }))
    .optional(),
});

export const ValidateUser = (user: User) => {
  const userJoiSchema = Joi.object<User>({
    name: Joi.string().min(3).required(),
    phoneNumber: Joi.string().min(10),
    email: Joi.string().email().required(),
    password: z.string().max(64),
  });
};

export interface Role {
  name: string;
  assignedDate: Date;
}

export interface User {
  id?: ObjectId;
  name: string;
  phoneNumber: string;
  email: string;
  dob?: Date;
  dateJoined?: Date;
  lastUpdated?: Date;
  tags?: string[];
  roles?: Role[];
  password?: string;
  hashedPassword?: string;
}
