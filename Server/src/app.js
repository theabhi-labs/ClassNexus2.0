import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL ,
    credentials: true
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