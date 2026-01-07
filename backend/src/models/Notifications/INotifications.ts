import { Types, Document } from "mongoose";

export type NotificationType =
  | "ticket_purchased"
  | "ticket_used"
  | "event_reminder"
  | "chat_message"
  | "event_updated";

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  payload: Record<string, any>;
  channel: string;
  status: "read" | "unread";
  createdAt: Date;
}
