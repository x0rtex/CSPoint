import express, { Router } from "express";
import {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../controllers/match";
import {
  validJWTProvided,
  isAdmin,
  isEditor,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createMatchSchema, updateMatchSchema } from "../schemas/match";

const router: Router = express.Router();

router.get("/", getMatches);
router.get("/:id", getMatch);
router.post(
  "/",
  validate(createMatchSchema),
  validJWTProvided,
  createMatch,
);
router.put(
  "/:id",
  validate(updateMatchSchema),
  validJWTProvided,
  isEditor,
  updateMatch,
);
router.delete("/:id", validJWTProvided, isAdmin, deleteMatch);

export default router;
