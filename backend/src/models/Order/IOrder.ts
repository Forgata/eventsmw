import { Types, Document } from "mongoose";

export interface IOrderTicketItem {
  ticketTypeId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export type PaymentStatus =
  | "pending"
  | "success"
  | "failed"
  | "expired"
  | "refunded";

export interface BasicWebhookData {
  id?: string;
  event?: string;
  type?: string;
  data?: Record<string, unknown>;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  ticketItems: IOrderTicketItem[];
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentProvider: "stripe" | "paychangu";
  paymentIntentId: string;
  webhookData: BasicWebhookData;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
