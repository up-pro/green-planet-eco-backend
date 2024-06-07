import express, { Router } from "express";
import { signIn, signUp, verifyEmail } from "../controllers/authController";

const router: Router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/verifyEmail/:token", verifyEmail);

module.exports = router;
