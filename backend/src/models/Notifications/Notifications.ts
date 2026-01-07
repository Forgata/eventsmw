import mongoose, { Schema, model } from "mongoose";
import type { INotification } from "./INotifications.js";
// todo Add validations for required props where possible

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: {
      type: String,
      enum: [
        "ticket_purchased",
        "ticket_used",
        "event_reminder",
        "chat_message",
        "event_updated",
      ],
      required: true,
    },
    payload: { type: Schema.Types.Mixed, required: true },
    channel: { type: String, required: true },
    status: {
      type: String,
      enum: ["read", "unread"],
      required: true,
      default: "unread",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification = model<INotification>("Notification", NotificationSchema);
export default Notification;
