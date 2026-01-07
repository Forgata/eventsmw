import mongoose, { Schema, model } from "mongoose";
import type { ITicket } from "./ITicket.js";

// todo Add validations for required props where possible

const TicketSchema = new Schema<ITicket>({
  orderId: { type: mongoose.Types.ObjectId, required: true, ref: "Order" },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  eventId: { type: mongoose.Types.ObjectId, required: true, ref: "Event" },
  ticketTypeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "TicketType",
  },
  ticketUID: { type: String, required: true, unique: true },
  qrToken: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["active", "used", "cancelled", "expired"],
    default: "active",
  },
  issuedAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date },
});

const Ticket = model<ITicket>("Ticket", TicketSchema);
export default Ticket;
