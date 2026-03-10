import puppeteer from "puppeteer";
import QRCode from "qrcode";
import { certificateTemplate } from "../templates/certificateTemplate.js";

export const generateCertificatePDF = async (enrollment) => {

  const verifyUrl = `${process.env.BASE_URL}/verify/${enrollment.certificate.certificateId}`;
  const qrCode = await QRCode.toDataURL(verifyUrl);

  const html = certificateTemplate({
    studentName: enrollment.student.name,
    enrollmentNo: enrollment.enrollmentNo,
    courseName: enrollment.course.title,
    startDate: new Date(enrollment.enrolledAt).toDateString(),
    endDate: new Date().toDateString(),
    attendance: 90,
    grade: "A",
    issueDate: new Date(enrollment.certificate.issuedAt).toDateString(),
    certificateId: enrollment.certificate.certificateId,
    qrCode
  });

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    landscape: true,
    printBackground: true,
  });

  await browser.close();

  return pdf;
};