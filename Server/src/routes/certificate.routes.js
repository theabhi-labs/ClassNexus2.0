import express from "express";
import {
  issueCertificate,
  getCertificateById,
  getCertificatesByEnrollment,
  verifyCertificate,
  getStudentPhoto,
} from "../controllers/certificate.controller.js"; 
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";
import validateRequest from "../middlewares/validateRequest.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { validateCertificateIssue } from "../validators/certificate.validator.js";

const router = express.Router();


router.get(
  "/verify/:certificateId", 
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }), // 100 requests per 15 mins
  verifyCertificate
);


router.get(
  "/certificate/:certificateId", 
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 50 }),
  getCertificateById
);

router.get(
  "/enrollment/:enrollmentNumber", 
  getCertificatesByEnrollment
);


router.post(
  "/issue/:enrollmentId",
  isAuthenticated,
  authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.INSTRUCTOR),
  validateRequest(validateCertificateIssue),
  issueCertificate
);




router.get(
  "/student-photo/:studentId",
  isAuthenticated,
  authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.INSTRUCTOR, UserRolesEnum.STUDENT),
  getStudentPhoto
);

export default router;