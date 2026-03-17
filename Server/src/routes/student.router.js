import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.middlewares.js";
import {
  addStudent,
  updateStudent,
  updateEnrollment,
  deleteStudent,
  getAllStudents,
  getStudentDetails,
  getAdminDashboardStudents,
  updateStudentAndEnrollment,
  getUserProfile
} from "../controllers/student.controller.js";

import {
  validate,
  adminAddStudentValidator,
  updateStudentValidator,
  updateEnrollmentValidator,
  deleteStudentValidator,
  getAllStudentsValidator,
  getStudentDetailsValidator
} from "../validators/index.js";

const router = express.Router();


router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  adminAddStudentValidator,
  validate,
  addStudent
);

router.get("/:userId/profile", isAuthenticated, getUserProfile);

router.put("/update-full/:studentId",isAuthenticated, isAdmin, updateStudentAndEnrollment);

router.put(
  "/update/:studentId",
  isAuthenticated,
  isAdmin,
  updateStudentValidator,
  validate,
  updateStudent
);


router.put(
  "/enrollment/:enrollmentId",
  isAuthenticated,
  isAdmin,
  updateEnrollmentValidator,
  validate,
  updateEnrollment
);

router.get(
  "/admin-overview",
  isAuthenticated,
  isAdmin,
  getAdminDashboardStudents
);

router.get(
  "/getAllStudents",
  isAuthenticated,
  isAdmin,
  getAllStudentsValidator,
  validate,
  getAllStudents
);

router.get(
  "/:studentId",
  isAuthenticated,
  isAdmin,
  getStudentDetailsValidator,
  validate,
  getStudentDetails
);

router.delete(
  "/:studentId",
  isAuthenticated,
  isAdmin,
  deleteStudentValidator,
  validate,
  deleteStudent
);



export default router;
