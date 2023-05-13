import { Request, Response } from "express";
import {
  MAIL_TITLE_OF_CONTACT_US,
  MAIL_TITLE_OF_QUESTION
} from "../utils/constants";
const SibApiV3Sdk = require("sib-api-v3-sdk");
const Sib = require("../utils/Sib");
const { ADMIN_EMAIL } = process.env;

/** Contact Us */
export const contactToAdmin = (req: Request, res: Response) => {
  const { name, email, website, message } = req.body;

  if (!name || !email || !website) {
    return res.sendStatus(400);
  }

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = { email, name };
  const receivers = [{ email: ADMIN_EMAIL }];

  sendSmtpEmail.subject = MAIL_TITLE_OF_CONTACT_US;
  sendSmtpEmail.sender = sender;
  sendSmtpEmail.to = receivers;
  sendSmtpEmail.htmlContent = `
    <h1>${name}</h1>
    <a href="${website}" target="_blank">${website}</a>
    <p>${message}</p>
  `;

  // const mailOptions = {
  //   sender,
  //   to: receivers,
  //   subject: MAIL_TITLE_OF_CONTACT_US,
  //   htmlContent: `
  //     <h1>${name}</h1>
  //     <a href="${website}" target="_blank">${website}</a>
  //     <p>${message}</p>
  //   `,
  // };

  tranEmailApi
    .sendTransacEmail(sendSmtpEmail)
    .then((result: any) => {
      console.log("# result => ", result);
      return res.sendStatus(200);
    })
    .catch((error: any) => {
      console.log("# error => ", error);
      return res.sendStatus(500);
    });
};

/** Ask questions */
export const askQuestion = (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email) {
    return res.sendStatus(400);
  }

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = { email, name };
  const receivers = [{ email: ADMIN_EMAIL }];

  sendSmtpEmail.subject = MAIL_TITLE_OF_QUESTION;
  sendSmtpEmail.sender = sender;
  sendSmtpEmail.to = receivers;
  sendSmtpEmail.htmlContent = `
    <h1>${name}</h1>
    <p>${message}</p>
  `;
  // const mailOptions = {
  //   sender,
  //   to: receivers,
  //   subject: MAIL_TITLE_OF_QUESTION,
  //   htmlContent: `
  //     <h1>${name}</h1>
  //     <p>${message}</p>
  //   `,
  // };

  tranEmailApi
    .sendTransacEmail(sendSmtpEmail)
    .then((result: any) => {
      console.log("# result => ", result);
      return res.sendStatus(200);
    })
    .catch((error: any) => {
      console.log("# error => ", error);
      return res.sendStatus(500);
    });
};
