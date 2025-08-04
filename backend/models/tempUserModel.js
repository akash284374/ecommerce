import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: { type: String, required: true, unique: true },
    password: String,
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

export const TempUser = mongoose.model("TempUser", tempUserSchema);
