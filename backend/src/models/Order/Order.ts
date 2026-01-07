import mongoose, { Schema, model } from "mongoose";
import type { IOrder } from "./IOrder.js";

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    eventId: { type: Schema.Types.ObjectId, required: true, ref: "Event" },
    ticketItems: [
      {
        ticketTypeId: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        currency: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "expired", "refunded"],
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: ["stripe", "paychangu"],
      required: true,
    },
    paymentIntentId: { type: String, required: true },
    webhookData: {
      id: { type: String },
      event: { type: String },
      type: { type: String },
      data: { type: Schema.Types.Mixed },
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;
