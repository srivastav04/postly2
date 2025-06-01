import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({}));
app.use("/", router);

mongoose
  .connect(
    "mongodb+srv://srivastav:sojCQCgGZYaAz8Pt@cluster0.ck6zo.mongodb.net/postly"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
