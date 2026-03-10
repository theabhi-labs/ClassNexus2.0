import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import Payment from "../models/payment.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";


const generateEnrollmentNumber = async () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  const prefix = `JAS${month}${year}`;
  const count = await Enrollment.countDocuments({
    enrollmentNo: { $regex: `^${prefix}` }
  });
  const sequence = String(count + 1).padStart(3, "0");
  return `${prefix}${sequence}`;
};
const addStudent = asyncHandler(async (req, res) => {
  const {
    userId,
    dob,
    mobileNum,
    courseId,
    joinType = "ADMIN",
    payment
  } = req.body;

  if (!userId || !courseId || !dob) {
    throw new ApiError(400, "UserId, CourseId and DOB are required");
  }

  if (!["ADMIN", "ONLINE"].includes(joinType)) {
    throw new ApiError(400, "Invalid join type");
  }

  // 1️⃣ Find or create student
  let student = await Student.findOne({ user: userId });

  if (!student) {
    if (!mobileNum) {
      throw new ApiError(400, "Mobile number & Aadhar required");
    }

    student = await Student.create({
      user: userId,
      dob,
      mobileNum,
    });
  }

  // 2️⃣ Prevent duplicate enrollment
  const alreadyEnrolled = await Enrollment.findOne({
    student: student._id,
    course: courseId
  });

  if (alreadyEnrolled) {
    throw new ApiError(409, "Student already enrolled in this course");
  }

  // 3️⃣ Payment logic
  let paymentData = {
    amount: 0,
    status: "SUCCESS"
  };

  if (joinType === "ONLINE") {
    if (!payment?.amount || !payment?.method || !payment?.transactionId) {
      throw new ApiError(400, "Online payment details missing");
    }

    paymentData = {
      amount: payment.amount,
      method: payment.method,
      transactionId: payment.transactionId,
      status: "SUCCESS"
    };
  }

  const enrollmentNo = await generateEnrollmentNumber();

  // 5️⃣ Create enrollment
  const enrollment = await Enrollment.create({
    enrollmentNo,
    student: student._id,
    course: courseId,
    joinType,
    payment: paymentData,
    status: "ACTIVE"
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { student, enrollment },
      `Student enrolled via ${joinType}`
    )
  );
});

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Fetch user basic info
    const user = await User.findById(userId).select("name email profilePhoto");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 2️⃣ Fetch student info
    const student = await Student.findOne({ user: userId }).lean();
    if (!student) return res.status(404).json({ success: false, message: "Student info not found" });

    // 3️⃣ Fetch enrollments + course info
    const enrollments = await Enrollment.find({ student: student._id })
      .populate("course", "title duration price") // course details
      .lean();

    // 4️⃣ For each enrollment, calculate payments & prepare certificate info
    const enrollmentData = await Promise.all(
      enrollments.map(async (enr) => {
        const payments = await Payment.find({ enrollment: enr._id })
          .select("paymentFor paidAmount method transactionId paymentDate")
          .lean();

        const totalFee = enr.course.price;
        const paidAmount = payments.reduce((sum, p) => sum + p.paidAmount, 0);
        const remainingBalance = totalFee - paidAmount;

        return {
          enrollmentNo: enr.enrollmentNo,
          course: {
            title: enr.course.title,
            duration: `${enr.course.duration.value} ${enr.course.duration.unit}`,
          },
          joined: enr.enrolledAt,
          status: enr.status,
          payment: {
            totalFee,
            paidAmount,
            remainingBalance,
            history: payments.map((p) => ({
              date: p.paymentDate,
              amount: p.paidAmount,
              method: p.method,
              txnId: p.transactionId,
            })),
          },
          certificate: enr.certificate?.issued
            ? {
                issued: true,
                certificateId: enr.certificate.certificateId,
                issuedAt: enr.certificate.issuedAt,
                downloadUrl: `/api/certificate/download/${enr.certificate.certificateId}`,
              }
            : { issued: false },
        };
      })
    );

    // 5️⃣ Send final API response
    res.json({
      success: true,
      data: {
        profile: {
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
        },
        student: {
          dob: student.dob,
          mobile: student.mobileNum,
          documents: student.documents,
        },
        enrollments: enrollmentData,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateStudentAndEnrollment = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { mobileNum, dob, courseId, status, paymentStatus } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Student update
  if (mobileNum) student.mobileNum = mobileNum;
  if (dob) student.dob = dob;

  await student.save();

  // Enrollment update
  const enrollment = await Enrollment.findOne({ student: studentId });

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  if (courseId) {
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existing && existing._id.toString() !== enrollment._id.toString()) {
      throw new ApiError(400, "Student already enrolled in this course");
    }

    enrollment.course = courseId;
  }

  if (status) enrollment.status = status;

  if (paymentStatus) {
    enrollment.payment.status = paymentStatus;
  }

  await enrollment.save();

  const updatedEnrollment = await Enrollment
    .findById(enrollment._id)
    .populate("course");

  return res.status(200).json({
    message: "Student and Enrollment updated successfully",
    student,
    enrollment: updatedEnrollment
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { mobileNum, dob, course } = req.body;

  const student = await Student.findById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // mobile update
  if (mobileNum) student.mobileNum = mobileNum;

  // dob update
  if (dob) student.dob = dob;

  // course update (validate courseId)
  if (course) {
    const courseExists = await Course.findById(course);

    if (!courseExists) {
      throw new ApiError(404, "Course not found");
    }

    student.course = course;
  }

  await student.save();

  const updatedStudent = await Student.findById(studentId).populate("course");

  return res.status(200).json(
    new ApiResponse(200, updatedStudent, "Student updated successfully")
  );
});

const updateEnrollment = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.params;
  const { status, paymentStatus, courseId } = req.body;
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }
  if (status) enrollment.status = status;
  if (paymentStatus) {
    enrollment.payment.status = paymentStatus;
  }

  if (courseId) {
    enrollment.course = courseId;
  }

  await enrollment.save();

  const updatedEnrollment = await Enrollment
    .findById(enrollmentId)
    .populate("course");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEnrollment, "Enrollment updated"));
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // 1️⃣ Delete all enrollments
  await Enrollment.deleteMany({ student: studentId });

  // 2️⃣ Get userId before deleting student
  const userId = student.user;

  // 3️⃣ Delete student profile
  await student.deleteOne();

  // 4️⃣ Delete user account
  if (userId) {
    await User.findByIdAndDelete(userId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User, Student and Enrollments deleted successfully"));
});


const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .populate("user", "name email photo")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched"));
});


const getStudentDetails = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findById(studentId)
    .populate("user", "name email photo");

  if (!student) throw new ApiError(404, "Student not found");

  const enrollments = await Enrollment.find({ student: studentId })
    .populate("course", "title price duration");

  return res.status(200).json(
    new ApiResponse(
      200,
      { student, enrollments },
      "Student details fetched"
    )
  );
});

const getAdminDashboardStudents = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "student" })
    .select("name email")
    .lean();

  const students = await Student.find().lean();

  const enrollments = await Enrollment.find()
    .populate("course", "title")
    .lean();

  const result = users.map(user => {
    const student = students.find(
      s => s.user.toString() === user._id.toString()
    );

    const enrollment = student
      ? enrollments.find(
        e => e.student.toString() === student._id.toString()
      )
      : null;

    return {
      userId: user._id,
      studentId: student?._id || null,
      enrollmentId: enrollment?._id || null,

      name: user.name,
      email: user.email,

      mobile: student?.mobileNum || "",
      dob: student?.dob || "",

      course: enrollment?.course?.title || "",
      enrollmentNo: enrollment?.enrollmentNo || "",
      joined: enrollment?.enrolledAt || "",

      // ✅ IMPORTANT FIX
      status: enrollment ? enrollment.status : "INACTIVE"
    };
  });

  res.status(200).json({
    success: true,
    data: result
  });
});



export {
  addStudent,
  updateStudent,
  updateEnrollment,
  deleteStudent,
  getAllStudents,
  getStudentDetails,
  getAdminDashboardStudents,
  updateStudentAndEnrollment
};
