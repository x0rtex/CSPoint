import express, { Router } from "express";
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/team";
import {
  validJWTProvided,
  isAdmin,
  isEditor,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTeamSchema, updateTeamSchema } from "../schemas/team";

const router: Router = express.Router();

router.get("/", getTeams);
router.get("/:id", getTeam);
router.post(
  "/",
  validate(createTeamSchema),
  validJWTProvided,
  createTeam,
);
router.put(
  "/:id",
  validate(updateTeamSchema),
  validJWTProvided,
  isEditor,
  updateTeam,
);
router.delete("/:id", validJWTProvided, isAdmin, deleteTeam);

export default router;
