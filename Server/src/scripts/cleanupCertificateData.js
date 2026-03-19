// scripts/cleanupCertificateData.js
import mongoose from "mongoose";
import Enrollment from "../models/enrollment.model.js";
import Certificate from "../models/certificate.model.js";
import dotenv from "dotenv";

dotenv.config();

async function cleanupCertificateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find all enrollments that have certificate data
    const enrollments = await Enrollment.find({
      "certificate.issued": true
    });

    console.log(`Found ${enrollments.length} enrollments with certificate data`);

    let updated = 0;
    let missingCertificates = [];

    for (const enrollment of enrollments) {
      // Check if certificate exists in Certificate model
      const certificate = await Certificate.findOne({
        certificateId: enrollment.certificate?.certificateId
      });

      if (!certificate && enrollment.certificate?.certificateId) {
        // Certificate missing - need to create it
        missingCertificates.push({
          enrollmentId: enrollment._id,
          certificateId: enrollment.certificate.certificateId,
          enrollmentNo: enrollment.enrollmentNo
        });
      }

      // Remove certificate field from enrollment
      await Enrollment.updateOne(
        { _id: enrollment._id },
        { $unset: { certificate: 1 } }
      );
      
      updated++;
      console.log(`✅ Cleaned enrollment: ${enrollment.enrollmentNo}`);
    }

    console.log("\n📊 Cleanup Summary:");
    console.log(`Total processed: ${enrollments.length}`);
    console.log(`Updated: ${updated}`);
    console.log(`Missing certificates: ${missingCertificates.length}`);

    if (missingCertificates.length > 0) {
      console.log("\n⚠️ Missing Certificates:");
      missingCertificates.forEach(item => {
        console.log(`- Enrollment: ${item.enrollmentNo}, Certificate ID: ${item.certificateId}`);
      });
    }

  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run cleanup
cleanupCertificateData();