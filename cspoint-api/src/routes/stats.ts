import express, { Router } from "express";
import { getStats } from "../controllers/stats";
import { validJWTProvided, isAdmin } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/", validJWTProvided, isAdmin, getStats);

export default router;
