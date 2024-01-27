import express from "express";
import { authGuard, login, signup } from "../controller/authController";
import { deleteMe, updateMe } from "../controller/userController";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.patch("/update-me", authGuard, updateMe);
router.delete("/delete-me", authGuard, deleteMe);

export default router;
