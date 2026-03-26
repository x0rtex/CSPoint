import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import playerRoutes from "./routes/players";
import teamRoutes from "./routes/teams";
import matchRoutes from "./routes/matches";
import newsRoutes from "./routes/news";
import { initDb } from "./database";

dotenv.config();
export const app: Application = express();

initDb().then();

app.use(morgan("tiny"));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/players", playerRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/matches", matchRoutes);
app.use("/api/v1/news", newsRoutes);

app.get("/health", async (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});
