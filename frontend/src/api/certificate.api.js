// frontend/src/api/certificate.api.js
import api from "./axios.js";

// Issue certificate for enrollment (Protected - Admin/Instructor)
export const certificateIssue = (enrollmentId) =>
  api.post(`/certificates/issue/${enrollmentId}`);

// Get certificate by ID - Returns PDF blob
export const getCertificate = (certificateId) =>
  api.get(`/certificates/certificate/${certificateId}`, {
    responseType: "blob",
  });

// Verify certificate by ID (Public)
export const verifyCertificate = (certificateId) =>
  api.get(`/certificates/verify/${certificateId}`);

// Get certificates by enrollment number
export const getCertificateByEnrollment  = (enrollmentNumber) =>
  api.get(`/certificates/enrollment/${enrollmentNumber}`);

// Get certificate by enrollment ID
export const getCertificateByEnrollmentId = (enrollmentId) =>
  api.get(`/certificates/enrollment-id/${enrollmentId}`);

// Get all certificates (Admin only)
export const getAllCertificates = () =>
  api.get('/certificates/all');


export const revokeCertificate = (certificateId) =>
  api.delete(`/certificates/revoke/${certificateId}`);

// Get student photo
export const getStudentPhoto = (studentId) =>
  api.get(`/certificates/student-photo/${studentId}`);