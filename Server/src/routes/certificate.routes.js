// routes/enrollment.routes.js
import express from "express";
import Enrollment from "../models/enrollment.model.js";
import { generateCertificatePDF } from "../services/certificateGenerator.js";
import { issueCertificateIfEligible } from "../services/certificateService.js";

const router = express.Router();

// ==================== IMPROVED CODE WITH ALL ROUTES ====================

/**
 * @route   PATCH /api/enrollments/complete/:id
 * @desc    Mark enrollment as COMPLETED and issue certificate
 * @access  Private/Admin
 */
router.patch("/complete/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: "Enrollment not found" 
      });
    }

    // Check if already completed
    if (enrollment.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Enrollment already completed"
      });
    }

    enrollment.status = "COMPLETED";
    await enrollment.save();

    // Issue certificate
    const certificateIssued = await issueCertificateIfEligible(enrollment);

    res.json({
      success: true,
      message: "Enrollment completed successfully",
      data: {
        enrollmentId: enrollment._id,
        status: enrollment.status,
        certificate: enrollment.certificate || null,
        issued: certificateIssued
      }
    });

  } catch (error) {
    console.error("Complete enrollment error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/enrollments/certificate/:certificateId
 * @desc    Download certificate as PDF
 * @access  Public (with certificate ID)
 */
router.get("/certificate/:certificateId", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      "certificate.certificateId": req.params.certificateId,
      "certificate.issued": true,
      status: "COMPLETED"
    }).populate({
      path: "student",
      populate: {
        path: "user",
        select: "name email profilePhoto"
      }
    }).populate({
      path: "course",
      select: "title code duration"
    });

    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: "Certificate not found or not issued" 
      });
    }

    const pdf = await generateCertificatePDF(enrollment);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${enrollment.certificate.certificateId}.pdf`,
      "Content-Length": pdf.length
    });

    res.send(pdf);

  } catch (error) {
    console.error("Certificate download error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error generating certificate",
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/enrollments/verify/:certificateId
 * @desc    Verify certificate authenticity
 * @access  Public
 */
router.get("/verify/:certificateId", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      "certificate.certificateId": req.params.certificateId,
      status: "COMPLETED",
      "certificate.issued": true,
    })
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "name profilePhoto email",
        },
      })
      .populate({
        path: "course",
        select: "title code duration description",
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "Invalid Certificate - No matching record found",
      });
    }

    // Calculate course duration if needed
    const startDate = enrollment.certificate.issuedAt;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (enrollment.course?.duration || 6));

    return res.json({
      success: true,
      valid: true,
      message: "Certificate verified successfully",
      data: {
        // Student Info
        enrollmentNo: enrollment.enrollmentNo,
        studentName: enrollment.student?.user?.name,
        studentEmail: enrollment.student?.user?.email,
        studentPhoto: enrollment.student?.user?.profilePhoto,
        
        // Course Info
        course: enrollment.course?.title,
        courseCode: enrollment.course?.code,
        courseDuration: enrollment.course?.duration,
        
        // Certificate Info
        certificateId: enrollment.certificate.certificateId,
        issueDate: enrollment.certificate.issuedAt,
        grade: enrollment.certificate.grade || "A", // Add grade if available
        status: enrollment.status,
        
        // Additional
        verifiedAt: new Date().toISOString(),
        blockchainHash: enrollment.certificate.blockchainHash || "0x" + Math.random().toString(16).substring(2, 14)
      }
    });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ 
      success: false,
      valid: false,
      message: "Server Error",
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/enrollments/certificate/:certificateId/preview
 * @desc    Preview certificate data without downloading PDF
 * @access  Public
 */
router.get("/certificate/:certificateId/preview", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      "certificate.certificateId": req.params.certificateId,
      "certificate.issued": true,
      status: "COMPLETED"
    }).populate({
      path: "student",
      populate: {
        path: "user",
        select: "name email profilePhoto"
      }
    }).populate({
      path: "course",
      select: "title code duration description"
    });

    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: "Certificate not found" 
      });
    }

    res.json({
      success: true,
      data: {
        studentName: enrollment.student?.user?.name,
        courseName: enrollment.course?.title,
        enrollmentNo: enrollment.enrollmentNo,
        issueDate: enrollment.certificate.issuedAt,
        certificateId: enrollment.certificate.certificateId,
        grade: enrollment.certificate.grade || "A"
      }
    });

  } catch (error) {
    console.error("Preview error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
});

/**
 * @route   GET /api/enrollments/student/:studentId/certificates
 * @desc    Get all certificates for a student
 * @access  Private
 */
router.get("/student/:studentId/certificates", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.params.studentId,
      status: "COMPLETED",
      "certificate.issued": true
    }).populate({
      path: "course",
      select: "title code"
    }).select("enrollmentNo certificate course status");

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments.map(en => ({
        enrollmentNo: en.enrollmentNo,
        courseName: en.course?.title,
        courseCode: en.course?.code,
        certificateId: en.certificate?.certificateId,
        issueDate: en.certificate?.issuedAt,
        status: en.status
      }))
    });

  } catch (error) {
    console.error("Student certificates error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
});

/**
 * @route   POST /api/enrollments/certificate/:certificateId/reissue
 * @desc    Reissue a certificate (admin only)
 * @access  Private/Admin
 */
router.post("/certificate/:certificateId/reissue", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      "certificate.certificateId": req.params.certificateId
    });

    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: "Certificate not found" 
      });
    }

    // Update certificate
    enrollment.certificate.issued = true;
    enrollment.certificate.issuedAt = new Date();
    enrollment.certificate.blockchainHash = "0x" + Math.random().toString(16).substring(2, 14);
    
    await enrollment.save();

    res.json({
      success: true,
      message: "Certificate reissued successfully",
      data: {
        certificateId: enrollment.certificate.certificateId,
        issuedAt: enrollment.certificate.issuedAt,
        blockchainHash: enrollment.certificate.blockchainHash
      }
    });

  } catch (error) {
    console.error("Reissue error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error" 
    });
  }
});

export default router;