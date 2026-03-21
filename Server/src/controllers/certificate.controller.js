import Certificate from "../models/certificate.model.js";
import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";


const checkExistingCertificate = async (enrollmentId) => {
  return await Certificate.findOne({ enrollment: enrollmentId });
};

export const issueCertificateIfEligible = async (enrollment) => {
  try {
    // ✅ Check in Certificate model directly, not in enrollment.certificate
    const existingCert = await Certificate.findOne({ 
      enrollment: enrollment._id 
    });
    
    if (existingCert) {
      return existingCert;
    }

    // Check eligibility
    if (enrollment.status !== "COMPLETED") {
      return null;
    }

    // Generate Certificate ID
    const certificateId = "CERT-" + 
      new Date().getFullYear() + "-" + 
      uuidv4().slice(0, 8).toUpperCase();

    // Generate Verification URL
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const verificationUrl = `${baseUrl}/api/verify/${certificateId}`;

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    // ✅ Create Certificate ONLY in Certificate model
    const certificate = await Certificate.create({
      certificateId,
      enrollment: enrollment._id,
      student: enrollment.student._id,
      enrollmentNumber: enrollment.enrollmentNo,
      course: {
        id: enrollment.course._id,
        name: enrollment.course.title || enrollment.course.name,
        duration: enrollment.course.duration
      },
      studentDetails: {
        name: enrollment.student?.user?.name || "Student",
        profilePhoto: enrollment.student?.user?.profilePhoto || ""
      },
      issueDate: new Date(),
      qrCode: {
        imageUrl: qrCodeDataUrl,
        data: verificationUrl
      },
      verificationUrl,
      isValid: true
    });

    return certificate;
  } catch (error) {
    console.error("Error in issueCertificateIfEligible:", error);
    throw error;
  }
}


export const issueCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

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
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // 🔍 DEBUGGING - Check all required data
    console.log("========== DEBUG INFO ==========");
    console.log("1. Enrollment ID:", enrollment._id);
    console.log("2. Student ID:", enrollment.student?._id);
    console.log("3. Student User:", enrollment.student?.user?._id);
    console.log("4. Course ID:", enrollment.course?._id);
    console.log("5. Course Title:", enrollment.course?.title);
    console.log("6. Course Duration:", enrollment.course?.duration);
    console.log("7. Student Name:", enrollment.student?.user?.name);
    console.log("8. Student DOB:", enrollment.student?.dob);
    console.log("9. Student Mobile:", enrollment.student?.mobileNum);
    console.log("================================");

    // Agar course duration undefined hai to fix karo
    let courseDuration = enrollment.course?.duration;
    if (!courseDuration || !courseDuration.value) {
      courseDuration = { value: 6, unit: "months" };
      console.log("⚠️ Course duration missing, using default");
    }

    // Agar student details missing hain to fix karo
    let studentName = enrollment.student?.user?.name;
    if (!studentName) {
      studentName = "Student";
      console.log("⚠️ Student name missing, using default");
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ enrollment: enrollmentId });
    if (existingCert) {
      return res.json({ success: true, message: "Certificate already exists" });
    }

    // Generate data
    const certificateId = "CERT-" + new Date().getFullYear() + "-" + 
                          uuidv4().slice(0, 8).toUpperCase();
    
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const verificationUrl = `${baseUrl}/api/verify/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    // ✅ TRY TO CREATE CERTIFICATE
    try {
      const certificate = await Certificate.create({
        certificateId,
        enrollment: enrollment._id,
        student: enrollment.student._id,
        enrollmentNumber: enrollment.enrollmentNo,
        course: {
          id: enrollment.course._id,
          name: enrollment.course.title || "Course",
          duration: courseDuration,
          level: enrollment.course.level || "Beginner",
          mode: enrollment.course.mode || "Online"
        },
        studentDetails: {
          name: studentName,
          profilePhoto: enrollment.student?.user?.profilePhoto || "",
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

      console.log("✅ Certificate created successfully!");
      
      return res.status(201).json({
        success: true,
        message: "Certificate issued successfully",
        data: certificate
      });

    } catch (createError) {
      // 🔥 Agar create fail ho to exact error batao
      console.error("❌ Certificate creation failed:", createError);
      
      // Mongoose validation error
      if (createError.name === "ValidationError") {
        const errors = {};
        for (let field in createError.errors) {
          errors[field] = createError.errors[field].message;
        }
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors
        });
      }
      
      throw createError;
    }

  } catch (error) {
    console.error("Issue certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to issue certificate",
      error: error.message
    });
  }
};


export const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email profilePhoto"
        }
      })
      .lean();

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    // Get fresh profile photo from User model
    const student = await Student.findById(certificate.student._id)
      .populate("user", "profilePhoto");
    
    const profilePhoto = student?.user?.profilePhoto || 
                        certificate.studentDetails.profilePhoto || "";

    res.json({
      success: true,
      data: {
        studentName: certificate.studentDetails.name,
        studentPhoto: profilePhoto,
        enrollmentNumber: certificate.enrollmentNumber,
        courseName: certificate.course.name,
        courseDuration: `${certificate.course.duration.value} ${certificate.course.duration.unit}`,
        certificateId: certificate.certificateId,
        verificationUrl: certificate.verificationUrl,
        issueDate: certificate.issueDate,
        issuedBy: certificate.issuedBy.name,
        organization: certificate.issuingOrganization.name
      }
    });

  } catch (error) {
    console.error("Get certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
      error: error.message
    });
  }
};


export const getCertificatesByEnrollment = async (req, res) => {
  try {
    const { enrollmentNumber } = req.params;

    // First find the enrollment to get student info
    const enrollment = await Enrollment.findOne({ enrollmentNo: enrollmentNumber })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name profilePhoto"
        }
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    // Find all certificates for this enrollment
    const certificates = await Certificate.find({ 
      enrollmentNumber,
      isValid: true 
    })
    .sort({ issueDate: -1 })
    .lean();

    if (!certificates.length) {
      return res.status(404).json({
        success: false,
        message: "No certificates found for this enrollment number"
      });
    }

    // Get profile photo
    const profilePhoto = enrollment.student?.user?.profilePhoto || "";

    res.json({
      success: true,
      data: {
        studentName: enrollment.student?.user?.name || "Student",
        studentPhoto: profilePhoto,
        enrollmentNumber,
        totalCertificates: certificates.length,
        certificates: certificates.map(cert => ({
          courseName: cert.course.name,
          courseDuration: `${cert.course.duration.value} ${cert.course.duration.unit}`,
          certificateId: cert.certificateId,
          verificationUrl: cert.verificationUrl,
          issueDate: cert.issueDate
        }))
      }
    });

  } catch (error) {
    console.error("Get certificates by enrollment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificates",
      error: error.message
    });
  }
};


export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("user-agent");

    const certificate = await Certificate.findOne({ certificateId })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name email profilePhoto"
        }
      })
      .lean();

    if (!certificate) {
      return res.json({
        success: true,
        valid: false,
        message: "Certificate not found or invalid"
      });
    }

    // Check if revoked
    if (!certificate.isValid) {
      return res.json({
        success: true,
        valid: false,
        message: "This certificate has been revoked",
        reason: certificate.revocationReason,
        revokedAt: certificate.revokedAt
      });
    }

    // Check expiry
    const isExpired = certificate.expiryDate && 
                      new Date() > new Date(certificate.expiryDate);

    // Get fresh profile photo
    const student = await Student.findById(certificate.student._id)
      .populate("user", "profilePhoto");
    
    const profilePhoto = student?.user?.profilePhoto || 
                        certificate.studentDetails.profilePhoto || "";

    // Record verification scan
    await Certificate.findOneAndUpdate(
      { certificateId },
      {
        $inc: { "verificationStats.totalScans": 1 },
        $set: { "verificationStats.lastScanAt": new Date() },
        $push: {
          "verificationStats.scanHistory": {
            ip: ip,
            userAgent: userAgent,
            scannedAt: new Date()
          }
        }
      }
    );

    res.json({
      success: true,
      valid: !isExpired,
      isExpired,
      data: {
        studentName: certificate.studentDetails.name,
        studentPhoto: profilePhoto,
        courseName: certificate.course.name,
        courseDuration: `${certificate.course.duration.value} ${certificate.course.duration.unit}`,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        certificateId: certificate.certificateId,
        issuedBy: certificate.issuedBy.name,
        organization: certificate.issuingOrganization.name,
        verificationStats: {
          totalScans: certificate.verificationStats?.totalScans || 0,
          firstScan: certificate.verificationStats?.firstScanAt,
          lastScan: certificate.verificationStats?.lastScanAt
        }
      }
    });

  } catch (error) {
    console.error("Verify certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message
    });
  }
};


export const getStudentPhoto = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId)
      .populate("user", "profilePhoto");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      profilePhoto: student.user?.profilePhoto || ""
    });

  } catch (error) {
    console.error("Get student photo error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student photo",
      error: error.message
    });
  }
};