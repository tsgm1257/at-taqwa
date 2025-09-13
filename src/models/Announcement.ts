import { Schema, model, models } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    marquee: { type: Boolean, default: false },
    visibleTo: { type: String, enum: ["all", "members", "admins"], default: "all", index: true },
    publishedAt: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true }
);

export default models.Announcement || model("Announcement", AnnouncementSchema);
