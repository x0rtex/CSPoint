import express, { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserRoles,
  deleteUser,
} from "../controllers/users";
import { isAdmin, validJWTProvided } from "../middleware/auth.middleware";
import { createUserSchema } from "../schemas/user";
import { validate } from "../middleware/validate.middleware";

const router: Router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", updateUser);
router.patch("/:id/roles", validJWTProvided, isAdmin, updateUserRoles);
router.delete('/:id', validJWTProvided, isAdmin, deleteUser);

export default router;
