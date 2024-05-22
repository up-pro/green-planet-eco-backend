import { Request, Response } from "express";
import { Op } from "sequelize";
import config from "config";
import User from "../models/User.model";
import {
  EXPIRES_DURATION_EMAIL_VERIFY,
  JWT_SECRET,
  MAIL_TITLE_EMAIL_VERIFY,
  MSG_DUPLICATED_USER,
  MSG_JWT_ERROR,
  QUERY_PARAM_EMAIL_VERIFY,
} from "../utils/constants";
import sibApiInstance from "../utils/sibApiInstance";

const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require("@getbrevo/brevo");
const bcrypt = require("bcryptjs");
const { WEBSITE_URL, ADMIN_EMAIL } = process.env;

/**
 * User register
 * @param req
 * @param res
 * @returns
 */
export const signUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  //  Check whether a user who has same username or email is already existed or not
  const duplicatedUser = await User.findOne({
    where: {
      [Op.or]: {
        username,
        email,
      },
    },
  });
  if (duplicatedUser) return res.status(400).send(MSG_DUPLICATED_USER);

  //  Encrypt password
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  //  Create a user
  const newUser = (
    await User.create({
      ...req.body,
      password: encryptedPassword,
    })
  ).dataValues;

  jwt.sign(
    { user: newUser },
    config.get(JWT_SECRET),
    { expiresIn: EXPIRES_DURATION_EMAIL_VERIFY },
    (error: Error, token: string) => {
      if (error) return res.status(500).send(MSG_JWT_ERROR);

      try {
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        const sender = { email: ADMIN_EMAIL || "" };
        const receivers = [{ email }];

        sendSmtpEmail.subject = MAIL_TITLE_EMAIL_VERIFY;
        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = receivers;
        sendSmtpEmail.htmlContent = `
          <a href="${WEBSITE_URL}?${QUERY_PARAM_EMAIL_VERIFY}=${token}" target="_blank">${WEBSITE_URL}</a>
        `;

        sibApiInstance
          .sendTransacEmail(sendSmtpEmail)
          .then((result: any) => {
            console.log(">>>>> result => ", result);
            return res.sendStatus(200);
          })
          .catch((error: any) => {
            console.log(">>>>>> error => ", error);
            return res.sendStatus(500);
          });
      } catch (err) {
        console.log(">>> err => ", err);
        return res.status(500).send(err);
      }
    }
  );
};

/**
 * User login
 * @param req
 * @param res
 */
export const signIn = (req: Request, res: Response) => {};
