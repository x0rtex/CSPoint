import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.email().min(5),
  password: z.string().min(1).max(64),
  dob: z.coerce.date().optional(),
  phoneNumber: z.string().min(10).max(10).startsWith("0").optional(),
  roles: z.array(z.string()).min(1).max(3).default(["user"]).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const updateUserProfileSchema = updateUserSchema.omit({ roles: true });

export const updateUserRolesSchema = z.object({
  roles: z.array(z.enum(["user", "editor", "admin"])).min(1).max(3),
});
