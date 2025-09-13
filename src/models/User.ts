import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Member", "User"],
      default: "User",
      index: true,
    },

    // NEW
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
