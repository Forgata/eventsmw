import { Types, Document } from "mongoose";

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  attachments?: string[];
  createdAt: Date;
}
