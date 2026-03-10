import multer from "multer";
import { ApiError } from "../utils/api-error.js";

const storage = multer.memoryStorage();

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const imageFileFilter = (req, file, cb) => {
  if (imageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only jpeg, png, webp images are allowed"));
  }
};

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: imageFileFilter,
});


const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only PDF files are allowed"));
  }
};

export const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: pdfFileFilter,
});
