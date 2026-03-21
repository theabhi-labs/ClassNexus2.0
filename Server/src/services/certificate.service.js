import Certificate from "../models/certificate.model.js";
import Enrollment from "../models/enrollment.model.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

class CertificateService {
  
  static async createCertificate(enrollmentId) {
    try {
      const enrollment = await Enrollment.findById(enrollmentId)
        .populate({
          path: "student",
          populate: {
            path: "user",
            select: "name email profilePhoto"
          }
        })
        .populate("course");

      if (!enrollment) {
        throw new Error("Enrollment not found");
      }

      const existingCert = await Certificate.findOne({ 
        enrollment: enrollmentId 
      });

      if (existingCert) {
        console.log(`Certificate already exists: ${existingCert.certificateId}`);
        return existingCert;
      }

      const certificateId = "CERT-" + 
        new Date().getFullYear() + "-" + 
        uuidv4().slice(0, 8).toUpperCase();

      const baseUrl = process.env.BASE_URL || "http://localhost:5000";
      const verificationUrl = `${baseUrl}/api/verify/${certificateId}`;


      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

      const courseDuration = enrollment.course?.duration || { value: 6, unit: "months" };
      const studentName = enrollment.student?.user?.name || "Student";
      const profilePhoto = enrollment.student?.user?.profilePhoto || "";
      const courseName = enrollment.course?.title || enrollment.course?.name || "Course";
      const courseLevel = enrollment.course?.level || "Beginner";
      const courseMode = enrollment.course?.mode || "Online";

      const certificate = await Certificate.create({
        certificateId,
        enrollment: enrollment._id,
        student: enrollment.student._id,
        enrollmentNumber: enrollment.enrollmentNo,
        course: {
          id: enrollment.course._id,
          name: courseName,
          duration: {
            value: courseDuration.value || 6,
            unit: courseDuration.unit || "months"
          },
          level: courseLevel,
          mode: courseMode
        },
        studentDetails: {
          name: studentName,
          profilePhoto: profilePhoto,
          dob: enrollment.student?.dob || null,
          mobileNum: enrollment.student?.mobileNum || ""
        },
        issueDate: new Date(),
        issuedBy: {
          name: process.env.ISSUED_BY_NAME || "Admin",
          designation: process.env.ISSUED_BY_DESIGNATION || "Director"
        },
        issuingOrganization: {
          name: process.env.ORG_NAME || "Your Organization"
        },
        qrCode: {
          imageUrl: qrCodeDataUrl,
          data: verificationUrl
        },
        verificationUrl,
        isValid: true
      });

      // ✅ Update Enrollment document with certificate info
      await Enrollment.findByIdAndUpdate(enrollment._id, {
        $set: {
          certificate: {
            issued: true,
            certificateId: certificateId,
            issuedAt: new Date()
          }
        }
      });

      console.log(`✅ Certificate created: ${certificateId} for ${enrollment.enrollmentNo}`);
      return certificate;

    } catch (error) {
      console.error("❌ CertificateService.createCertificate error:", error);
      throw error;
    }
  }
}

export default CertificateService;