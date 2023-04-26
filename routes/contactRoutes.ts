import express, { Router } from "express";
import { askQuestion, contactToAdmin } from "../controllers/contactController";

const router: Router = express.Router();

router.post("/contact-to-admin", contactToAdmin);
router.post("/ask-question", askQuestion);

module.exports = router;
