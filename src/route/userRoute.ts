import express from "express";
import { signup } from "../controller/authController";
const router = express.Router();

router.post("/signup", signup);

export default router;
