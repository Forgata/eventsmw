import { Types, Document } from "mongoose";

export type TicketStatus = "active" | "used" | "cancelled" | "expired";

export interface ITicket extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  ticketTypeId: Types.ObjectId;

  ticketUID: string;
  qrToken: string;
  status: TicketStatus;
  issuedAt: Date;
  usedAt?: Date;
  expiresAt: Date;
}
