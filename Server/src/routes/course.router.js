import express from "express"
import { isAuthenticated, isAdmin } from "../middlewares/auth.middlewares.js"
import {
     createCourse,
     updateCourse,
     deleteCourse,
     getAllCourses,
     getCourseById
 } from "../controllers/course.controller.js"
 const router = express.Router();

router.post("/createCourse", createCourse);
router.put("/updateCourse/:courseId", updateCourse);
router.delete("/deleteCourse/:courseId",  deleteCourse);

router.get("/getCourses", getAllCourses);
router.get("/:courseId", getCourseById);

export default router;