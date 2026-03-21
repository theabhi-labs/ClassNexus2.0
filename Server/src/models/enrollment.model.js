import mongoose from "mongoose";
import crypto from "crypto";
import CertificateService from "../services/certificate.service.js";

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

    certificate: {
      issued: { type: Boolean, default: false },
      certificateId: { type: String },
      issuedAt: { type: Date },
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });


enrollmentSchema.pre('save', async function(next) {
  try {
    // Sirf tab trigger hoga jab status COMPLETED ho raha ho
    // aur pehle COMPLETED nahi tha
    if (this.isModified('status') && this.status === 'COMPLETED') {
      
      console.log(`\n🎯 Enrollment ${this.enrollmentNo} completed - generating certificate...`);
      
      try {
        // Certificate create karne ke liye service call karo
        const certificate = await CertificateService.createCertificate(this._id);
        
        if (certificate) {
          console.log(`✅ Auto certificate created: ${certificate.certificateId}`);
          this.certificate = {
            issued: true,
            certificateId: certificate.certificateId,
            issuedAt: certificate.issueDate || new Date(),
          };
        }
      } catch (certError) {
        console.error(`❌ Auto certificate failed for ${this.enrollmentNo}:`, certError.message);
      }
    }
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    next(error);
  }
});

enrollmentSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'COMPLETED') {
    try {
      console.log(`\n🎯 Auto-Trigger: Enrollment ${doc.enrollmentNo} completed.`);
      const certificate = await CertificateService.createCertificate(doc._id);
      
      if (certificate) {
        console.log(`✅ Auto-Certificate Generated: ${certificate.certificateId}`);
      }
    } catch (error) {
      console.error("❌ Auto-Generation Error:", error.message);
    }
  }

});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

 export const updateEnrollmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    id, 
    { status }, 
    { new: true, runValidators: true } // 'new: true' zaroori hai hook ke liye
  );

  res.json({ success: true, data: updatedEnrollment });
};


export default Enrollment;
