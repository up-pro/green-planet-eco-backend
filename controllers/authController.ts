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
} from "../utils/constants";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { WEBSITE_URL, ADMIN_EMAIL } = process.env;

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "db624a0232ed0f",
    pass: "3fe337db515cb6",
  },
});

/**
 * User register
 * @param req
 * @param res
 * @returns
 */
export const signUp = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log(">>> username", username);

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

  jwt.sign(
    { user: { username, email } },
    config.get(JWT_SECRET),
    { expiresIn: EXPIRES_DURATION_EMAIL_VERIFY },
    async (error: Error, token: string) => {
      if (error) return res.status(500).send(MSG_JWT_ERROR);
      try {
        const sender = ADMIN_EMAIL;
        await transporter.sendMail({
          from: sender,
          to: email,
          subject: MAIL_TITLE_EMAIL_VERIFY,
          text: "# Auth Verification",
          html: `<a href="${WEBSITE_URL}/api/auth/verifyEmail/${token}" target="_blank">${WEBSITE_URL}</a>`,
        });
        
        //  Create a user
        await User.create({
          ...req.body,
          password: encryptedPassword,
          verified: false,
          token,
        });
        
        return res.status(200).send("EMAIL SENT");
      } catch (err) {
        console.log(">>> err => ", err);
        return res.status(500).send(err);
      }
    },
  );
};

/**
 * User login
 * @param req
 * @param res
 */
export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(">>> email", email);

  const user = await User.findOne({
    where: {
      email
    },
  });

  // check if user exist
  if (!user) {
    return res.status(404).send("User doesnt exist");
  }

  //  compare password
  const isPasswordValid = await bcrypt.compare(password, user.getDataValue("password"));
  if (!isPasswordValid) {
    return res.status(401).send("Authentication Failed! Wrong Password");
  }

  // check if user is verified
  const isVerified = user.getDataValue("verified");
  if (!isVerified) {
    return res.status(400).send("User is not verified");
  }

  // generate jwt token
  const token = jwt.sign(
    { user: { email } },
    config.get(JWT_SECRET),
    { expiresIn: EXPIRES_DURATION_EMAIL_VERIFY });

  // set jwt cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 // 1 day
  });

  // return user data
  return res.status(200).send(user);
};

/**
 * Email verify
 * @param req
 * @param res
 */
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, config.get(JWT_SECRET));

    const user = await User.findOne({
      where: {
        [Op.or]: {
          username: decoded.user.username,
          email: decoded.user.email,
        },
      },
    });

    if (!user) return res.status(400).send("Invalid Token");

    if (user.getDataValue("verified")) {
      return res
        .status(200)
        .send("User has been already verified. Please Login");
    } else {
      await User.update(
        { verified: true, token: null },
        {
          where: {
            [Op.or]: {
              username: decoded.user.username,
              email: decoded.user.email,
            },
          },
        },
      );
      return res.status(200).send("EMAIL VERIFIED");
    }
  } catch (err) {
    console.log(">>> err => ", err);
    return res.status(500).send(err);
  }
};
