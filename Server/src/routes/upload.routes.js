import express from "express";
import { uploadImage, uploadPdf } from "../middlewares/upload.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { 
  downloadStudentDocument, 
  uploadProfilePhoto,
  uploadStudentDocument ,
  previewStudentDocument 
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/profile",
  isAuthenticated,
  uploadImage.single("file"),
  uploadProfilePhoto
);

router.post(
  "/student/:studentId/upload/:type",
  uploadPdf.single("document"),
  uploadStudentDocument
);

router.get(
  "/student/:studentId/preview/:type",
  previewStudentDocument
);

router.get(
  "/student/:studentId/download/:type",
  downloadStudentDocument
);

export default router;
