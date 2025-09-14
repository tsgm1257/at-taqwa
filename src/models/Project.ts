import { Schema, model, models, Types } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    targetAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
      index: true,
    },
    image: { type: String },
    startDate: { type: Date, default: () => new Date() },
    endDate: { type: Date },
    createdBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
