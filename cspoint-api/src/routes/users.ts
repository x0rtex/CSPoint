import express, { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users";
import { authenticateKey, validJWTProvided } from "../middleware/auth.middleware";
import { createUserSchema } from "../models/user";
import { validate } from "../middleware/validate.middleware";

const router: Router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", authenticateKey, validate(createUserSchema), createUser);
router.put("/:id", authenticateKey, updateUser);
router.delete('/:id', validJWTProvided, deleteUser);

export default router;
