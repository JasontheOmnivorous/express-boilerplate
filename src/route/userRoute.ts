import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controller/adminController";
import {
  authGuard,
  login,
  restrictAccess,
  signup,
} from "../controller/authController";
import { deleteMe, updateMe } from "../controller/userController";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.patch("/update-me", authGuard, updateMe);
router.delete("/delete-me", authGuard, deleteMe);

router.use(authGuard, restrictAccess("admin"));
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
