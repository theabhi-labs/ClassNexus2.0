// scripts/checkDuplicates.js
import mongoose from "mongoose";
import Certificate from "../models/certificate.model.js";
import Enrollment from "../models/enrollment.model.js";
import dotenv from "dotenv";

dotenv.config();

async function checkDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if any enrollment still has certificate field
    const enrollmentsWithCert = await Enrollment.find({
      "certificate.issued": { $exists: true }
    });

    if (enrollmentsWithCert.length > 0) {
      console.log(`❌ Found ${enrollmentsWithCert.length} enrollments with certificate field`);
    } else {
      console.log("✅ No enrollments with certificate field - GOOD!");
    }

    // Check all certificates
    const certificates = await Certificate.find();
    console.log(`\nTotal certificates in Certificate model: ${certificates.length}`);

    // Verify each certificate has valid enrollment
    let invalidCerts = 0;
    for (const cert of certificates) {
      const enrollment = await Enrollment.findById(cert.enrollment);
      if (!enrollment) {
        console.log(`⚠️ Certificate ${cert.certificateId} has invalid enrollment reference`);
        invalidCerts++;
      }
    }

    if (invalidCerts === 0) {
      console.log("✅ All certificates have valid enrollment references");
    }

  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDuplicates();