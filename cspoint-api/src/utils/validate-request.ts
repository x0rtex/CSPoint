import { z } from "zod";
import { Request, Response } from "express";

export function validateRequest(
  schema: z.ZodSchema,
  req: Request,
  res: Response,
): boolean {
  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      message: "Validation failed",
      errors: validation.error.issues,
    });
    return false;
  }
  return true;
}
