import { Schema, model, models, Types } from "mongoose";

const DonationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    projectId: { type: Types.ObjectId, ref: "Project" },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "BDT" },
    method: { type: String, enum: ["sslcommerz", "bkash", "nagad", "cash"], required: true },
    status: { type: String, enum: ["initiated", "pending", "succeeded", "failed", "refunded"], default: "pending" },
    receiptUrl: { type: String }, // optional proof for cash
    meta: { type: Schema.Types.Mixed }, // gateway payloads
  },
  { timestamps: true }
);

export default models.Donation || model("Donation", DonationSchema);
