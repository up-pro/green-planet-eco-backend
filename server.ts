import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();

//  Prevent cors error
app.use(
  cors({
    origin: "*",
  })
);

// Init Middleware
app.use(express.json());

// Define Routes
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/affiliate", require("./routes/affiliateRoutes"));
app.use("/api/membership", require("./routes/membershipRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
