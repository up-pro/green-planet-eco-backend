import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const CarbonCredit = sequelize.define(
  "carbon_credits",
  {
    membership_id: DataTypes.INTEGER,
    purchaser_id: DataTypes.INTEGER,
  },
  {
    timestamps: true,
  }
);

export default CarbonCredit;
