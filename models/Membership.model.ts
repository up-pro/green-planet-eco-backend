import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Membership = sequelize.define(
  "memberships",
  {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
  },
  {
    timestamps: true,
  }
);

export default Membership;
