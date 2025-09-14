import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String },
    location: { type: String, required: true },
    category: {
      type: String,
      enum: ["Community", "Education", "Charity", "Religious", "General"],
      default: "General",
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    maxAttendees: { type: Number },
    registrationRequired: { type: Boolean, default: false },
    contactInfo: { type: String },
    attendees: [{ type: String }], // Array of user emails
    createdBy: { type: String }, // Admin email who created the event
  },
  { timestamps: true }
);

export default models.Event || model("Event", EventSchema);
