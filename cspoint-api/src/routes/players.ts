import express, { Router } from "express";
import {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/player";
import {
  validJWTProvided,
  isAdmin,
  isEditor,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createPlayerSchema, updatePlayerSchema } from "../schemas/player";

const router: Router = express.Router();

router.get("/", getPlayers);
router.get("/:id", getPlayer);
router.post(
  "/",
  validate(createPlayerSchema),
  validJWTProvided,
  createPlayer,
);
router.put(
  "/:id",
  validate(updatePlayerSchema),
  validJWTProvided,
  isEditor,
  updatePlayer,
);
router.delete("/:id", validJWTProvided, isAdmin, deletePlayer);

export default router;
