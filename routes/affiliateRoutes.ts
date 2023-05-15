import express, { Router } from "express";
import {
  getAffiliateLink,
  payToAffiliator,
  sendAffiliateLink
} from "../controllers/affiliateController";

const router: Router = express.Router();

router.post("/send-affiliate-link", sendAffiliateLink);
router.post("/pay-to-affiliator", payToAffiliator);
router.get("/get-affiliate-link/:senderWallet", getAffiliateLink);

module.exports = router;
