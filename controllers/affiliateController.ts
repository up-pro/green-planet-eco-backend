import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const config = require("config");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const Sib = require("../utils/Sib");
import { CONTRACT_ABI, MAIL_TITLE_OF_AFFILIATE } from "../utils/constants";
import { IAffiliator } from "../utils/interfaces";
import { ethers } from "ethers";
const {
  WEBSITE_URL,
  ADMIN_WALLET_PRIVATE_KEY,
  CHAIN_ID,
  RPC_URL,
  CONTRACT_ADDRESS
} = process.env;

export const sendAffiliateLink = async (req: Request, res: Response) => {
  const { senderEmail, senderWallet, receiverEmail } = req.body;

  jwt.sign(
    { senderWallet },
    config.get("jwtSecret"),
    {},
    (error: Error, token: string) => {
      if (error) {
        return res.sendStatus(500);
      }

      let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      const tranEmailApi = new Sib.TransactionalEmailsApi();

      const sender = { email: senderEmail };
      const receivers = [{ email: receiverEmail }];

      sendSmtpEmail.subject = MAIL_TITLE_OF_AFFILIATE;
      sendSmtpEmail.sender = sender;
      sendSmtpEmail.to = receivers;
      sendSmtpEmail.htmlContent = `
        <a href="${WEBSITE_URL}/invite/${token}" target="_blank">${WEBSITE_URL}</a>
      `;

      tranEmailApi
        .sendTransacEmail(sendSmtpEmail)
        .then((result: any) => {
          return res.sendStatus(200);
        })
        .catch((error: any) => {
          return res.sendStatus(500);
        });
    }
  );
};

export const payToAffiliator = async (req: Request, res: Response) => {
  const { tokenAmount, affiliateToken } = req.body;

  jwt.verify(
    affiliateToken,
    config.get("jwtSecret"),
    async (error: Error, sender: IAffiliator) => {
      if (error) {
        return res.sendStatus(401);
      }
      const { senderWallet } = sender;
      const network = ethers.providers.getNetwork(CHAIN_ID || "");
      const provider = new ethers.providers.JsonRpcProvider(RPC_URL, network);
      const signer = new ethers.Wallet(
        ADMIN_WALLET_PRIVATE_KEY || "",
        provider
      );
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS || "",
        CONTRACT_ABI,
        signer
      );
      const tx = await contract.transfer(
        senderWallet,
        ethers.utils.parseEther(tokenAmount)
      );
      await tx.wait();
      return res.sendStatus(200);
    }
  );
};
