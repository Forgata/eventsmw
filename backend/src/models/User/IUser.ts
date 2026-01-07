import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  roles: ("user" | "admin" | "admin")[];
  avatarUrl?: string;
  phone?: string;
  interests?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
