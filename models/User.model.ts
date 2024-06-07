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
    verified: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
  },
  {
    timestamps: true,
  }
);

export default User;
