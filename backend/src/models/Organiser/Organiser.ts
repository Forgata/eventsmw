import mongoose, { model, Schema } from "mongoose";
import type { IOrganiser } from "./IOrganiser.js";

// todo Add validations for required props

const OrganiserSchema = new Schema<IOrganiser>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    paymentDetails: {
      provider: {
        type: String,
        enum: ["stripe", "paychangu", "paypal", "bank_transfer"],
      },
      stripeAccountId: { type: String },
      paychanguMerchantId: { type: String },
      payoutMethod: { type: String, enum: ["bank", "mobile_money", "wallet"] },
      payoutCurrency: { type: String },
      verified: { type: Boolean, default: false },
      verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
      },
      verificationType: { type: String },
      connectedAt: { type: Date },
      verifiedAt: { type: Date },
    },
  },
  { timestamps: true }
);

const Organiser = model<IOrganiser>("Organiser", OrganiserSchema);
export default Organiser;
