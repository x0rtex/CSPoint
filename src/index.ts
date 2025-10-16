import express, { Application, Request, Response } from "express";

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.get("/ping", async (_req: Request, res: Response) => {
  res.json({
    message: "Pong!",
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
