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

  // Launch browser with extra stability flags
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", // Uses disk instead of RAM for temporary files
      "--disable-gpu",            // Not needed for PDFs, saves memory
      "--no-zygote",              // Reduces process overhead
      "--single-process"          // Forces Chrome into one process (crucial for Free Tiers)
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set content with a timeout to prevent hanging forever
    await page.setContent(html, { 
      waitUntil: "networkidle0",
      timeout: 30000 
    });

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });

    return pdf;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  } finally {
    // This runs NO MATTER WHAT, preventing memory leaks
    if (browser) await browser.close();
  }
};