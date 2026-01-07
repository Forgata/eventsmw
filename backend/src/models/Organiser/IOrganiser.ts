import { Types, Document } from "mongoose";

export interface PaymentDetails {
  provider: "stripe" | "paychangu" | "paypal" | "bank_transfer";
  stripeAccountId?: string;
  paychanguMerchantId?: string;
  payoutMethod?: "bank" | "mobile_money" | "wallet";
  payoutCurrency?: string;
  verified: boolean;
  verificationStatus?: "pending" | "verified" | "rejected";
  verificationType?: string;
  connectedAt?: Date;
  verifiedAt?: Date;
}

export interface IOrganiser extends Document {
  _id: Types.ObjectId;
  // refereced fields
  userId: Types.ObjectId;

  name: string;
  bio?: string;
  verified: boolean;
  paymentDetails?: PaymentDetails;
  createdAt?: Date;
  updatedAt?: Date;
}
