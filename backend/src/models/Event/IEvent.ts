import { Types, Document } from "mongoose";

export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IEventStats {
  views: number;
  ticketsSold: number;
  revenue: number;
  currency?: string;
}

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  organiserId: Types.ObjectId;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  gallery?: string[];
  venue?: string;
  categoryId: Types.ObjectId;
  location?: IGeoPoint;
  startAt: Date;
  endAt?: Date;
  status: "draft" | "published" | "cancelled" | "completed";
  capacity?: number;
  stats: IEventStats;
  createdAt?: Date;
  updatedAt?: Date;
}
