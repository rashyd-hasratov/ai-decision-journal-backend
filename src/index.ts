import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./server";

dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL || "";

const start = async () => {
  await mongoose.connect(DB_URL);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
