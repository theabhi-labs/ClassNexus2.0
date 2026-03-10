import cron from "node-cron";
import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";

cron.schedule("1 0 1 * *", async () => {
  console.log("Cron job running: Checking monthly payments...");

  try {
    const enrollments = await Enrollment.find({ status: "ACTIVE" }).populate("course student");

    const now = new Date();
    now.setDate(1); 
    now.setHours(0, 0, 0, 0);

    for (const enrollment of enrollments) {
      const exists = await Payment.findOne({
        enrollment: enrollment._id,
        paymentFor: now
      });

      if (!exists) {
        const course = enrollment.course;
        const duration = course.duration?.value || 1;
        const monthlyAmount = Number((course.price / duration).toFixed(2));

        await Payment.create({
          enrollment: enrollment._id,
          student: enrollment.student._id,
          course: course._id,
          paymentType: "MONTHLY",
          paymentFor: now,
          expectedAmount: monthlyAmount,
          status: "PENDING"
        });

        console.log(`Monthly payment created for ${enrollment._id} for ${now}`);
      }
    }
  } catch (err) {
    console.error("Cron job error:", err);
  }
});
