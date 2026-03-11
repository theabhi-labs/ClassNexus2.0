import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const allowedOrigins = [
  "https://class-nexus2-0.vercel.app",
  "http://localhost:5173"  // Add your local dev URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // if sending cookies/JWT in headers
}));




app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(cookieParser());


import userRouter from "./routes/user.router.js"
import coursesRouter from "./routes/course.router.js"
import studentsRouter from "./routes/student.router.js"
import paymentRouter from "./routes/payment.router.js"
import upload from "./routes/upload.routes.js"
import certificate from "./routes/certificate.routes.js"

app.use("/api/v1/users",userRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/pay", paymentRouter);
app.use("/api/v1/upload", upload);
app.use("/api/v1/certificate", certificate);


export default app;