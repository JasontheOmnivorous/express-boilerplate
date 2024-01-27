import express from "express";
import { login, signup } from "../controller/authController";
import { deleteMe, updateMe } from "../controller/userController";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.patch("/update-me", updateMe);
router.delete("/delete-me", deleteMe);

export default router;
