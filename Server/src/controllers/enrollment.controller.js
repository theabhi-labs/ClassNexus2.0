import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import Student from "../models/student.model.js";
import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import { issueCertificateIfEligible } from "./certificate.controller.js";  // ✅ ONLY THIS LINE CHANGED

const enrollStudent = asyncHandler(async (req, res) => {
  const { userId, courseId, joinType = "ADMIN" } = req.body;

  if (!userId || !courseId)
    throw new ApiError(400, "UserId & CourseId required");

  const student = await Student.findOne({ user: userId });
  if (!student) throw new ApiError(404, "Student not found");

  const existingEnrollment = await Enrollment.findOne({
    student: student._id,
    course: courseId,
  });

  if (existingEnrollment)
    throw new ApiError(409, "Already enrolled in this course");

  const enrollment = await Enrollment.create({
    student: student._id,
    course: courseId,
    joinType,
    status: "ACTIVE",
  });

  res
    .status(201)
    .json(new ApiResponse(201, enrollment, "Student enrolled successfully"));
});

const setupPayment = asyncHandler(async (req, res) => {
  const { enrollmentId, paymentType } = req.body;

  if (!enrollmentId || !paymentType)
    throw new ApiError(400, "EnrollmentId & PaymentType required");

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw new ApiError(404, "Enrollment not found");

  const course = await Course.findById(enrollment.course);
  if (!course) throw new ApiError(404, "Course not found");

  // 🔒 Prevent duplicate setup
  const existingPayment = await Payment.findOne({
    enrollment: enrollment._id,
  });

  if (existingPayment)
    throw new ApiError(400, "Payment already initialized for this enrollment");

  /* ==========================
     ONE TIME
  ========================== */
  if (paymentType === "ONE_TIME") {
    const payment = await Payment.create({
      enrollment: enrollment._id,
      student: enrollment.student,
      course: enrollment.course,
      paymentType: "ONE_TIME",
      expectedAmount: course.price,
      paidAmount: course.price,
      status: "PAID",
      paymentDate: new Date(),
    });

    return res
      .status(201)
      .json(new ApiResponse(201, payment, "One-time payment created"));
  }

  /* ==========================
     MONTHLY (First Month Only)
  ========================== */
if (paymentType === "MONTHLY") {
  const duration = course.duration?.value || 1;
  if (!course.price || duration <= 0)
    throw new ApiError(400, "Invalid course price or duration");

  const monthlyAmount = Number((course.price / duration).toFixed(2));

  // 🔹 Only first month
  const firstMonth = new Date();
  firstMonth.setDate(1); // month ka 1st date

  const payment = await Payment.create({
    enrollment: enrollment._id,
    student: enrollment.student,
    course: enrollment.course,
    paymentType: "MONTHLY",
    paymentFor: firstMonth,
    expectedAmount: monthlyAmount,
    status: "PENDING",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, payment, "First month payment initialized"));
}

  throw new ApiError(400, "Invalid payment type");
});

const updatePayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { paidAmount, method, transactionId, status, paymentFor } = req.body;
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, "Payment record not found");

  if (paidAmount !== undefined) {
    if (paidAmount > payment.expectedAmount)
      throw new ApiError(400, "Overpayment not allowed");

    payment.paidAmount = paidAmount;
  }

  if (method) {
    if (method === "UPI" && !transactionId)
      throw new ApiError(400, "Transaction ID required for UPI");

    payment.method = method;
  }

  if (transactionId) payment.transactionId = transactionId;
  if (status) payment.status = status;

  if (paymentFor) {
    payment.paymentFor = new Date(paymentFor);
  }

  if (payment.paidAmount > 0 && !payment.paymentDate) {
    payment.paymentDate = new Date();
  }

  await payment.save();

  res
    .status(200)
    .json(new ApiResponse(200, payment, "Payment updated successfully"));
});

const getAllStudentPayments = asyncHandler(async (req, res) => {

  const enrollments = await Enrollment.find()
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "name email"
      }
    })
    .populate({
      path: "course",
      select: "title price duration"
    })
    .lean();

  const enrollmentIds = enrollments.map(e => e._id);

  const payments = await Payment.find({
    enrollment: { $in: enrollmentIds }
  }).lean();

  // 🔥 Group payments by enrollment
  const paymentMap = {};

  payments.forEach(p => {
    const key = p.enrollment.toString();

    if (!paymentMap[key]) {
      paymentMap[key] = [];
    }

    paymentMap[key].push(p);
  });

  // 🔥 Final Response Structure
  const result = enrollments.map(enrollment => {

    const history = paymentMap[enrollment._id.toString()] || [];

    const firstPayment = history[0];

    return {
      userId: enrollment.student?.user?._id,
      studentId: enrollment.student?._id,
      enrollmentId: enrollment._id,

      name: enrollment.student?.user?.name,
      email: enrollment.student?.user?.email,

      enrollmentNo: enrollment.enrollmentNo,

      course: enrollment.course?.title,
      coursePrice: enrollment.course?.price,
      duration: enrollment.course?.duration,

      paymentType: firstPayment?.paymentType || null,

      history
    };
  });

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

export {
  enrollStudent,
  setupPayment,
  updatePayment,
  getAllStudentPayments,
}