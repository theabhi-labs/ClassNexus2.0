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

  // Validate required fields
  const requiredFields = [
    { field: title, name: "Title" },
    { field: shortDescription, name: "Short description" },
    { field: description, name: "Description" },
    { field: price, name: "Price" },
    { field: duration?.value, name: "Duration value" },
    { field: duration?.unit, name: "Duration unit" },
  ];

  for (const { field, name } of requiredFields) {
    if (!field) {
      throw new ApiError(400, `${name} is required`);
    }
  }

  // Validate title length
  if (title.length > 100) {
    throw new ApiError(400, "Title must be under 100 characters");
  }

  // Validate short description length
  if (shortDescription.length > 200) {
    throw new ApiError(400, "Short description must be under 200 characters");
  }

  // Validate duration unit
  const validUnits = ["days", "weeks", "months"];
  if (!validUnits.includes(duration.unit.toLowerCase())) {
    throw new ApiError(400, "Duration unit must be days, weeks, or months");
  }

  // Validate duration value
  if (duration.value < 1) {
    throw new ApiError(400, "Duration value must be at least 1");
  }

  // Validate level if provided
  const validLevels = ["Beginner", "Intermediate", "Advanced"];
  if (level && !validLevels.includes(level)) {
    throw new ApiError(400, "Level must be Beginner, Intermediate, or Advanced");
  }

  // Validate mode if provided
  const validModes = ["Online", "Offline", "Hybrid"];
  if (mode && !validModes.includes(mode)) {
    throw new ApiError(400, "Mode must be Online, Offline, or Hybrid");
  }

  // Validate price
  if (price < 0) {
    throw new ApiError(400, "Price cannot be negative");
  }

  // Check for duplicate course title
  const existingCourse = await Course.findOne({ title: title.trim() });
  if (existingCourse) {
    throw new ApiError(400, "A course with this title already exists");
  }

  try {
    // Prepare course data
    const courseData = {
      title: title.trim(),
      thumbnail: thumbnail?.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      price: Number(price),
      duration: {
        value: Number(duration.value),
        unit: duration.unit.toLowerCase(),
      },
      level: level || "Beginner",
      language: language || "Hindi",
      mode: mode || "Offline",
      certificateProvided: certificateProvided === true || certificateProvided === "true",
      projectsIncluded: Number(projectsIncluded) || 0,
      maxStudents: Number(maxStudents) || 50,
      skillsYouLearn: Array.isArray(skillsYouLearn) ? skillsYouLearn : [],
      careerOpportunities: Array.isArray(careerOpportunities) ? careerOpportunities : [],
      syllabus: Array.isArray(syllabus) ? syllabus : [],
      createdBy: req.user?._id, // Get from auth middleware
    };

    // Create course
    const course = await Course.create(courseData);

    return res
      .status(201)
      .json(
        new ApiResponse(201, course, "Course created successfully")
      );
  } catch (error) {
    console.error("Course creation error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (val) => val.message
      );
      throw new ApiError(400, `Validation failed: ${messages.join(", ")}`);
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      throw new ApiError(400, "A course with this title or slug already exists");
    }

    throw new ApiError(500, error.message || "Internal server error");
  }
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
      (req.body.maxStudents !== undefined && req.body.maxStudents !== "")
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