import { Schema, model, models } from "mongoose";

const MembershipRequestSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["pending", "approved", "denied"], default: "pending", index: true },
    reviewedBy: { type: String }, // admin email
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export default models.MembershipRequest || model("MembershipRequest", MembershipRequestSchema);
