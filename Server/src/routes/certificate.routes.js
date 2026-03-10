import express from "express";
import Enrollment from "../models/enrollment.model.js";
import { generateCertificatePDF } from "../services/certificateGenerator.js";
import { issueCertificateIfEligible } from "../services/certificateService.js";

const router = express.Router();

router.patch("/complete/:id", async (req, res) => {

  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment)
    return res.status(404).json({ message: "Enrollment not found" });

  enrollment.status = "COMPLETED";

  await issueCertificateIfEligible(enrollment); // 🔥 THIS IS MISSING

  res.json({
    message: "Enrollment completed & certificate issued",
    certificate: enrollment.certificate,
  });
});

router.get("/certificate/:certificateId", async (req, res) => {

  const enrollment = await Enrollment.findOne({
    "certificate.certificateId": req.params.certificateId,
    "certificate.issued": true,
    status: "COMPLETED"
  }).populate("student course");

  if (!enrollment)
    return res.status(404).json({ message: "Enrollment not found" });

  const pdf = await generateCertificatePDF(enrollment);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${enrollment.certificate.certificateId}.pdf`,
  });

  res.send(pdf);
});


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
          select: "name profilePhoto",
        },
      })
      .populate({
        path: "course",
        select: "title",
      });

    if (!enrollment) {
      return res.status(404).json({
        valid: false,
        message: "Invalid Certificate",
      });
    }

    return res.json({
      valid: true,
      enrollmentNo: enrollment.enrollmentNo,   // 🔥 yeh add kiya
      studentName: enrollment.student?.user?.name,
      studentPhoto: enrollment.student?.user?.profilePhoto,
      course: enrollment.course?.title,
      issueDate: enrollment.certificate.issuedAt,
      certificateId: enrollment.certificate.certificateId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;