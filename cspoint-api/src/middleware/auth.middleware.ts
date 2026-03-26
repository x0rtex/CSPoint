import { Request, Response, NextFunction } from "express";
import { verify as jwtVerify } from "jsonwebtoken";

export const validJWTProvided = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    console.log("no header " + authHeader);
    res.status(401).send();
    return;
  }

  const token: string | undefined = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send();
    return;
  }
  const secret = process.env.JWTSECRET || "not very secret";

  try {
    console.log(token);
    const payload = jwtVerify(token, secret);
    res.locals.payload = payload;
    next();
  } catch (err) {
    res.status(403).send();
    return;
  }
};

export const isEditor = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const roles = res.locals?.payload?.roles;

  if (
    (roles && Array.isArray(roles) && roles.includes("editor")) ||
    (roles && Array.isArray(roles) && roles.includes("admin"))
  ) {
    next();
  } else {
    res.status(403).json({ error: "Editor access required" });
  }
};

export const isAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const roles = res.locals?.payload?.roles;

  if (roles && Array.isArray(roles) && roles.includes("admin")) {
    next();
  } else {
    res.status(403).json({ error: "Admin access required" });
  }
};
