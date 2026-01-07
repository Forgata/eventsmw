import mongoose, { Schema, model } from "mongoose";
import type { IUser } from "./IUser.js";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
    phone: { type: String },
    interests: { type: [String] },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);
export default User;
