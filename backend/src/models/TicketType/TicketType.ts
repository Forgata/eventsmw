import mongoose, { Schema, model } from "mongoose";
import type { ITicketType } from "./ITicketType.js";

const TicketTypeSchema = new Schema<ITicketType>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, ref: "Event" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    saleStart: { type: Date },
    SaleEnd: { type: Date },
    satus: {
      type: String,
      enum: ["active", "sold_out", "paused", "ended", "hidden"],
      default: "active",
    },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const TicketType = model<ITicketType>("TicketType", TicketTypeSchema);
export default TicketType;
