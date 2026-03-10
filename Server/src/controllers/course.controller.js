import Course from "../models/course.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

/* ================= CREATE COURSE (ADMIN) ================= */
 const createCourse = asyncHandler(async (req, res) => {
  const { title, thumbnail, shortDescription, description, price, duration } = req.body;

  if (!title || !thumbnail || !shortDescription || !description || !price || !duration?.value) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const course = await Course.create({
    title,
    thumbnail,
    shortDescription,
    description,
    price,
    duration,
    // createdBy: req.user._id,
  });

  res.status(201).json(
    new ApiResponse(201, course, "Course created successfully")
  );
});

/* ================= UPDATE COURSE (ADMIN) ================= */
 const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  Object.assign(course, req.body);
  await course.save();

  res.status(200).json(
    new ApiResponse(200, course, "Course updated successfully")
  );
});

/* ================= DELETE COURSE (ADMIN) ================= */
 const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  await course.deleteOne();

  res.status(200).json(
    new ApiResponse(200, {}, "Course deleted successfully")
  );
});

/* ================= GET ALL COURSES (PUBLIC) ================= */
import Student from "../models/student.model.js";

const getAllCourses = asyncHandler(async (_, res) => {
  const courses = await Course.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean(); // 🔥 important

  const coursesWithStudents = await Promise.all(
    courses.map(async (course) => {
      const studentsCount = await Student.countDocuments({
        course: course._id, // or courses: course._id (depending on model)
      });

      return {
        ...course,
        students: studentsCount,
      };
    })
  );

  res.status(200).json(
    new ApiResponse(
      200,
      coursesWithStudents,
      "Courses fetched successfully"
    )
  );
});


/* ================= GET SINGLE COURSE ================= */
 const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  res.status(200).json(
    new ApiResponse(200, course, "Course fetched successfully")
  );
});

export {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseById
}