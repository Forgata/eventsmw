import { Types, Document } from "mongoose";

export type TicketStatus =
  | "active"
  | "sold_out"
  | "paused"
  | "ended"
  | "hidden";

export interface ITicketType extends Document {
  _id: Types.ObjectId;
  eventId: Types.ObjectId;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  saleStart?: Date;
  SaleEnd?: Date;
  satus: TicketStatus;
  meta?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
