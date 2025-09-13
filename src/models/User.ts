import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Member", "User"], default: "User" },
    phone: { type: String },
    profilePicUrl: { type: String },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
