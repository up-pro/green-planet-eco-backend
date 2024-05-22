import express, { Router } from "express";
import { signIn, signUp } from "../controllers/authController";

const router: Router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

module.exports = router;
