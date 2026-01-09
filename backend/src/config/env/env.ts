import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { encode } from "../../utils/crypto/crypto.js";

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "./.env") });

export const ENV = {
  MONGO_URI: process.env.MONGO_URI!,
  PORT: process.env.PORT || "5000",
  JWT_ACCESS_SECRET: encode(process.env.JWT_SECRET!),
  JWT_REFRESH_SECRET: encode(process.env.JWT_REFRESH_SECRET!),
  NODE_ENV: process.env.NODE_ENV,
  REFRESH_TTL_MS: process.env.REFRESH_TTL_MS!,
};
