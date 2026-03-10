import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserRolesEnum } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRolesEnum),
      default: UserRolesEnum.STUDENT,
    },

    isEnrolled: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: String,
    emailVerificationExpiry: Date,

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,

    refreshToken: String,

    profilePhoto: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  // Only hash if password is modified
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare Password Method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

