import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controller/adminController";
import { authGuard, restrictAccess } from "../controller/authController";
const router = express.Router();

router.use(authGuard, restrictAccess("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
