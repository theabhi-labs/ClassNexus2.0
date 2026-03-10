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

    certificate: {
      issued: { type: Boolean, default: false },
      certificateId: {
        type: String,
        unique: true,
        sparse: true,
      },
      issuedAt: Date,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

enrollmentSchema.pre("save", async function () {

  if (!this.enrollmentNo) {
    this.enrollmentNo =
      "ENR-" +
      new Date().getFullYear() +
      "-" +
      crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  if (this.isModified("status") && this.status === "COMPLETED") {

    if (!this.certificate) {
      this.certificate = {};
    }

    if (!this.certificate.issued) {

      this.certificate.issued = true;

      this.certificate.certificateId =
        "CERT-" +
        new Date().getFullYear() +
        "-" +
        crypto.randomBytes(4).toString("hex").toUpperCase();

      this.certificate.issuedAt = new Date();

    }

  }

});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
