import express from "express";
import { createCourse, updateCourse, deleteCourse, getAllCourses, getCourseById } from "../controllers/course.controller.js";
import { createCourseValidator } from "../validators/index.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

// Use the proper middleware
router.post("/createCourse", validateRequest(createCourseValidator), createCourse);
router.put("/updateCourse/:courseId", validateRequest(createCourseValidator), updateCourse);
router.delete("/deleteCourse/:courseId", deleteCourse);

router.get("/getCourses", getAllCourses);
router.get("/:courseId", getCourseById);

export default router;