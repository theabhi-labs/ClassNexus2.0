import crypto from "crypto";

export const issueCertificateIfEligible = async (enrollment) => {
  if (enrollment.status !== "COMPLETED") return;

  if (!enrollment.certificate) {
    enrollment.certificate = {};
  }

  if (enrollment.certificate.issued) return;

  enrollment.certificate = {
    issued: true,
    issuedAt: new Date(),
    certificateId: "CERT-" + crypto.randomBytes(4).toString("hex"),
  };

  await enrollment.save();
};