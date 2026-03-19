import mongoose from "mongoose";
import crypto from "crypto";

const enrollmentSchema = new mongoose.Schema(
  {
    enrollmentNo: {
      type: String,
      required: true,
      unique: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    joinType: {
      type: String,
      enum: ["ADMIN", "ONLINE"],
      required: true,
    },

    payment: {
      amount: { type: Number, default: 0 },
      method: {
        type: String,
        enum: ["UPI", "RAZORPAY", "CASH"],
      },
      transactionId: {
        type: String,
        required: function () {
          return this.joinType === "ONLINE";
        },
      },
      status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING",
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "DROPPED"],
      default: "ACTIVE",
    },


    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });


const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
