import { Request, Response } from "express";
import Membership from "../models/Membership.model";

export const getAll = (_: Request, res: Response) => {
  Membership.findAll()
    .then((data) => {
      return res.send(data);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
};
