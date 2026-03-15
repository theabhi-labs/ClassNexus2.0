import Course from "../models/course.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// --- CREATE COURSE ---
const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    thumbnail,
    shortDescription,
    description,
    price,
    duration,
    skillsYouLearn,
    careerOpportunities,
    level,
    language,
    mode,
    certificateProvided,
    projectsIncluded,
    syllabus
  } = req.body;

  // 1️⃣ Strict Validation
  if (
    [title, thumbnail, shortDescription, description].some(
      (field) => !field || field.trim() === ""
    ) ||
    !price ||
    !duration?.value
  ) {
    throw new ApiError(
      400,
      "Title, Thumbnail, Short Description, Description, Price and Duration are required"
    );
  }

  // 2️⃣ Create Course
  const course = await Course.create({
    title,
    thumbnail,
    shortDescription,
    description,

    price: Number(price),

    duration: {
      value: Number(duration.value),
      unit: duration.unit || "months",
    },

    level: level || "Beginner",
    language: language || "Hindi",
    mode: mode || "Offline",

    certificateProvided:
      typeof certificateProvided === "boolean"
        ? certificateProvided
        : true,

    projectsIncluded: Number(projectsIncluded) || 0,

    skillsYouLearn: Array.isArray(skillsYouLearn)
      ? skillsYouLearn
      : [],

    careerOpportunities: Array.isArray(careerOpportunities)
      ? careerOpportunities
      : [],

    syllabus: Array.isArray(syllabus) ? syllabus : [],

    // createdBy: req.user?._id
  });

  if (!course) {
    throw new ApiError(
      500,
      "Something went wrong while creating the course"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

// --- UPDATE COURSE ---
const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Pehle check karein course exist karta hai
  const existingCourse = await Course.findById(courseId);
  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  // Direct update with all fields from req.body
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: {
        ...req.body,
        // Optional: Ensure duration is properly formatted if sent
        ...(req.body.duration && {
            duration: {
                value: Number(req.body.duration.value),
                unit: req.body.duration.unit
            }
        })
      }
    },
    { 
      new: true, // Returns updated doc
      runValidators: true // Checks schema rules
    }
  );

  return res.status(200).json(
    new ApiResponse(200, updatedCourse, "Course updated successfully")
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