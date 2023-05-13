import mongoose from "mongoose";
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || db);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(">>>>>>> error => ", error);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
