import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const User = sequelize.define(
  "users",
  {
    username: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    membership_id: DataTypes.INTEGER,
  },
  {
    timestamps: true,
  }
);

export default User;
