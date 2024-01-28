import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import { UserType } from "../types/user";

const userSchema = new mongoose.Schema<UserType>({
  name: {
    type: String,
    required: [true, "Name is required."],
    minLength: [5, "Username must be longer than 5 characters."],
    maxLength: [20, "Username must be shorter than 20 characters."],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please provide a valid email."],
    required: [true, "Email is reqired."],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [10, "Password must be longer than 10 characters."],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: function (this: UserType, val: string) {
      return this.password === val;
    },
  },
  role: {
    type: String,
    // adjust rokes according to your app, but user and admin should be there by default
    enum: ["user", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiration: Date,
});

userSchema.pre("save", async function (this: UserType, next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 14);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.generatePasswordResetToken = function (this: UserType) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.passwordChangedAfterLogin = function (
  this: UserType,
  JWTIssuedAt: number
) {
  if (this.passwordChangedAt instanceof Date) {
    const changedTimestamp = Number(this.passwordChangedAt.getTime() / 1000);
    return JWTIssuedAt < changedTimestamp;
  }
};

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  password: string
) {
  return await bcrypt.compare(candidatePassword, password);
};

export const User = mongoose.model("User", userSchema);
