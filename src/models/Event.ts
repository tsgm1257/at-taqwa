import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: { type: String },
    visibility: { type: String, enum: ["public", "members", "admins"], default: "public" },
  },
  { timestamps: true }
);

export default models.Event || model("Event", EventSchema);
