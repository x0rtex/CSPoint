import { Request, Response } from "express";
import { collections } from "../database";
import { User } from "../models/user";
import * as argon2 from "argon2";
import { sign as jwtSign } from "jsonwebtoken";

const createAccessToken = (user: User | null): string => {
  const secret = process.env.JWTSECRET || "not very secret";
  const expiresTime = "2 mins";

  console.log(expiresTime);
  const payload: Object = {
    email: user?.email,
    username: user?.username,
    roles: user?.roles ?? ["user"],
  };
  const token = jwtSign(payload, secret, { expiresIn: expiresTime });

  return token;
};

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const dummyHash = await argon2.hash("time wasting");

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = (await collections.users?.findOne({
    email: email.toLowerCase(),
  })) as unknown as User;

  if (user && user.password) {
    const storedPassword = String(user.password);
    if (!storedPassword.startsWith("$")) {
      await argon2.verify(dummyHash, password);
      res.status(401).json({
        message: "Invalid email or password!",
      });
      return;
    }

    const isPasswordValid = await argon2.verify(storedPassword, password);
    // If password is valid send a token

    if (isPasswordValid) {
      const { password, ...safeUser } = user;
      res.status(201).json({ accessToken: createAccessToken(user), user: safeUser });
    } else {
      res.status(401).json({
        message: "Invalid email or password!",
      });
    }
    return;
  }

  // if here the user was not found or there was no hashedpassword.
  // the code below is so that the time taken will be roughly the same if the
  // password is incorrect or if the user does not exist.

  await argon2.verify(dummyHash, password);
  res.status(401).json({
    message: "Invalid email or password!",
  });
};
