import mongoose from "mongoose";
import { ENV } from "./env/env.js";

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    }
    console.error("Unknown error during MongoDB connection");
    process.exit(1);
  }
}
