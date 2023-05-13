import express, { Router } from "express";
import {
  payToAffiliator,
  sendAffiliateLink
} from "../controllers/affiliateController";

const router: Router = express.Router();

router.post("/send-affiliate-link", sendAffiliateLink);
router.post("/pay-to-affiliator", payToAffiliator);

module.exports = router;
