import mongoose, { Schema, model } from "mongoose";
import type { IEvent, IEventStats, IGeoPoint } from "./IEvent.js";

// todo Add validations for required props where possible

const EventSchema = new Schema<IEvent>(
  {
    organiserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organiser",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: { type: String, required: true },
    description: { type: String },
    coverImageUrl: { type: String },
    gallery: [{ type: String }],
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (val: number[]) {
            return val.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },
    capacity: { type: Number },
    stats: {
      views: { type: Number, default: 0 },
      ticketsSold: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      currency: { type: String },
    },
  },
  { timestamps: true }
);

const Event = model<IEvent>("Event", EventSchema);
export default Event;
