import mongoose from "mongoose";

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    paymentType: {
      type: String,
      enum: ["ONE_TIME", "MONTHLY"],
      required: true,
    },

    paymentFor: {
      type: Date, 
      required: function () {
        return this.paymentType === "MONTHLY";
      },
    },

    expectedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentDate: {
      type: Date,
    },

    method: {
      type: String,
      enum: ["UPI", "CASH", "BANK"],
    },

    transactionId: {
      type: String,
      required: function () {
        return this.method === "UPI";
      },
    },

    status: {
      type: String,
      enum: ["PAID", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

paymentSchema.index(
  { enrollment: 1, paymentFor: 1 },
  {
    unique: true,
    partialFilterExpression: {
      paymentType: "MONTHLY",
    },
  }
);

paymentSchema.pre("validate", function () {
  if (this.paidAmount > this.expectedAmount) {
    this.invalidate(
      "paidAmount",
      "Paid amount cannot be greater than expected amount"
    );
  }

  if (this.paidAmount > 0 && !this.paymentDate) {
    this.paymentDate = new Date();
  }
});


const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


