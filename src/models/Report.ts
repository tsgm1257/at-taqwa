import { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    title: { type: String, required: true },
    month: { type: String, required: true, index: true }, // "YYYY-MM"
    fileUrl: { type: String, required: true }, // link to PDF (for now)
    summary: { type: String },
    uploadedBy: { type: String }, // admin email or id
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReportSchema.index({ month: 1 }, { unique: true });

export default models.Report || model("Report", ReportSchema);
