import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
    },
    course: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      name: String,
      duration: {
        value: Number,
        unit: String,
      },
      level: String,
      mode: String,
    },
    studentDetails: {
      name: String,
      profilePhoto: String,
      dob: Date,
      mobileNum: String,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    issuedBy: {
      name: String,
      designation: String,
    },
    issuingOrganization: {
      name: String,
    },
    qrCode: {
      imageUrl: String,
      data: String,
    },
    verificationUrl: String,
    isValid: {
      type: Boolean,
      default: true,
    },
    revocationReason: String,
    revokedAt: Date,
    verificationStats: {
      totalScans: {
        type: Number,
        default: 0,
      },
      firstScanAt: Date,
      lastScanAt: Date,
      scanHistory: [
        {
          ip: String,
          userAgent: String,
          scannedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);


certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ enrollmentNumber: 1 });
certificateSchema.index({ student: 1 });
certificateSchema.index({ "course.id": 1 });

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;