import express, { Router } from "express";
import { askQuestion, contactToAdmin } from "../controllers/contactController";
import { getAll } from "../controllers/membershipController";

const router: Router = express.Router();

router.get("/", getAll);

module.exports = router;
