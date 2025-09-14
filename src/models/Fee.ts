import { Schema, model, models, Types } from "mongoose";

const FeeSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: String, required: true, index: true }, // "YYYY-MM"
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["unpaid", "partial", "paid", "waived"],
      default: "unpaid",
      index: true,
    },
    paidAmount: { type: Number, default: 0, min: 0 }, // NEW: track how much was paid (for partials)
    paidAt: { type: Date },
    notes: { type: String },
    meta: {
      tran_id: { type: String },
      ssl_sessionkey: { type: String },
      ssl_gw: { type: Object },
      payment_initiated_at: { type: Date },
      payment_tran_id: { type: String },
      payment_val_id: { type: String },
      payment_validated_at: { type: Date },
      ipn_status: { type: String },
      ipn_processed_at: { type: Date },
    },
  },
  { timestamps: true }
);

FeeSchema.index({ userId: 1, month: 1 }, { unique: true });

export default models.Fee || model("Fee", FeeSchema);
