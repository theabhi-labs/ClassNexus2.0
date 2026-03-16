import { body, validationResult } from "express-validator"
import { query } from "express-validator";
import { param } from "express-validator";
import Joi from "joi";

const userRegistrationValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters")
    .isLength({ max: 15 })
    .withMessage("Name cannot exceed 13 characters"),

  body().custom((value, { req }) => {
    const { email } = req.body;
    if (!email) {
      throw new Error("Either email  is required");
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      throw new Error("Email is invalid");
    }
    return true;
  }),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const userLoginValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];


export const adminAddStudentValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required"),

  body("mobileNum")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile number must be 10 digits"),

  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required"),
];

export const updateStudentValidator = [
  body("mobileNum")
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid mobile number"),

  body("documents.aadhar")
    .optional()
    .notEmpty()
    .withMessage("Aadhar cannot be empty"),
];

export const updateEnrollmentValidator = [
  body("status")
    .optional()
    .isIn(["ACTIVE", "COMPLETED", "DROPPED"])
    .withMessage("Invalid enrollment status"),

  body("payment.status")
    .optional()
    .isIn(["PENDING", "SUCCESS", "FAILED"])
    .withMessage("Invalid payment status"),

  body("payment.transactionId")
    .optional()
    .notEmpty()
    .withMessage("Transaction ID required"),
];

export const getAllStudentsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Search must be a valid string")
];

export const getStudentDetailsValidator = [
  param("studentId")
    .isMongoId()
    .withMessage("Invalid student ID")
];

export const deleteStudentValidator = [
  param("studentId")
    .isMongoId()
    .withMessage("Invalid student ID")
];


export const createCourseValidator = Joi.object({
  title: Joi.string().required(),
  thumbnail: Joi.string().required(),
  description: Joi.string().required(),
  shortDescription: Joi.string().required(),
  price: Joi.number().required(),
  duration: Joi.object({
    value: Joi.number().required(),
    unit: Joi.string().required()
  }).required(),
  maxStudents: Joi.number().required(),
  
  // ✅ Add these optional fields
  level: Joi.string().optional(),
  language: Joi.string().optional(),
  mode: Joi.string().optional(),
  certificateProvided: Joi.boolean().optional(),
  projectsIncluded: Joi.number().optional(),
  
  skillsYouLearn: Joi.array().items(Joi.string()).optional(),
  careerOpportunities: Joi.array().items(Joi.string()).optional(),
  syllabus: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      topics: Joi.array().items(Joi.string()).required()
    })
  ).optional()
});

export {
    userRegistrationValidator,
    validate
}