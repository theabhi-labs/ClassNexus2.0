import { v4 as uuidv4 } from "uuid";

export const issueCertificateIfEligible = async (enrollment) => {

  if (!enrollment.certificate) {
    enrollment.certificate = {};
  }

  if (
    enrollment.status === "COMPLETED" &&
    !enrollment.certificate.issued
  ) {
    enrollment.certificate.issued = true;
    enrollment.certificate.certificateId =
      "CERT-" + new Date().getFullYear() + "-" + uuidv4().slice(0, 6);

    enrollment.certificate.issuedAt = new Date();

    await enrollment.save();
  }

};