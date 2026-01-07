import mongoose, { Schema, model } from "mongoose";
import type { IChatMessage } from "./IChatMessage.js";

// todo Add validations for required props where possible

const ChatMessageSchema = new mongoose.Schema<IChatMessage>({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String },
  attachments: [{ type: String }], // store links to files
  createdAt: { type: Date, default: Date.now },
});

const ChatMessage = model<IChatMessage>("ChatMessage", ChatMessageSchema);
export default ChatMessage;
