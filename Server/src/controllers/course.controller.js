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
    maxStudents,
    syllabus,
  } = req.body;

  // ✅ Strict Validation
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

  // ✅ Create Course
  const course = await Course.create({
    title,
    thumbnail, // matches schema
    shortDescription,
    description, // matches schema
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
    maxStudents: Number(maxStudents) || 0,
    skillsYouLearn: Array.isArray(skillsYouLearn) ? skillsYouLearn : [],
    careerOpportunities: Array.isArray(careerOpportunities)
      ? careerOpportunities
      : [],
    syllabus: Array.isArray(syllabus) ? syllabus : [],
    // createdBy: req.user?._id
  });

  if (!course) {
    throw new ApiError(500, "Something went wrong while creating the course");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

// --- UPDATE COURSE ---
const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  // Check if course exists
  const existingCourse = await Course.findById(courseId);
  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  const updateData = {
    title: req.body.title ?? existingCourse.title,
    thumbnail: req.body.thumbnail ?? existingCourse.thumbnail,
    shortDescription:
      req.body.shortDescription ?? existingCourse.shortDescription,
    description: req.body.description ?? existingCourse.description,

    price: req.body.price
      ? Number(req.body.price)
      : existingCourse.price,

    duration: req.body.duration
      ? {
          value: Number(req.body.duration.value),
          unit: req.body.duration.unit || "months",
        }
      : existingCourse.duration,

    level: req.body.level ?? existingCourse.level,
    language: req.body.language ?? existingCourse.language,
    mode: req.body.mode ?? existingCourse.mode,

    certificateProvided:
      typeof req.body.certificateProvided === "boolean"
        ? req.body.certificateProvided
        : existingCourse.certificateProvided,

    projectsIncluded:
      req.body.projectsIncluded !== undefined
        ? Number(req.body.projectsIncluded)
        : existingCourse.projectsIncluded,

    maxStudents:
      req.body.maxStudents !== undefined
        ? Number(req.body.maxStudents)
        : existingCourse.maxStudents,

    skillsYouLearn: Array.isArray(req.body.skillsYouLearn)
      ? req.body.skillsYouLearn
      : existingCourse.skillsYouLearn,

    careerOpportunities: Array.isArray(req.body.careerOpportunities)
      ? req.body.careerOpportunities
      : existingCourse.careerOpportunities,

    syllabus: Array.isArray(req.body.syllabus)
      ? req.body.syllabus
      : existingCourse.syllabus,
  };

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: updateData },
    { new: true, runValidators: true }
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