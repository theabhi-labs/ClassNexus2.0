import express from "express";
import {
  issueCertificate,
  getCertificateById,
  getCertificatesByEnrollment,
  verifyCertificate,
  getStudentPhoto
} from "../controllers/certificate.controller.js"; 
import { isAuthenticated } from "../middlewares/auth.middleware.js"; // ✅ FIXED: Added verifyJWT import
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
router.get("/verify/:certificateId", verifyCertificate);
router.get("/certificate/:certificateId", getCertificateById);
router.get("/certificates/enrollment/:enrollmentNumber", getCertificatesByEnrollment);

// ========== PROTECTED ROUTES ==========
router.post(
  "/certificates/issue/:enrollmentId", 
  isAuthenticated,  
  authorizeRoles(UserRolesEnum.ADMIN, UserRolesEnum.INSTRUCTOR), 
  issueCertificate
);

router.get(
  "/student-photo/:studentId",
  isAuthenticated,  
  getStudentPhoto
);

export default router;