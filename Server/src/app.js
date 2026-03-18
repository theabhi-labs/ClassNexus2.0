import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
const allowedOrigins = [
  "https://class-nexus2-0.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  "https://class-nexus2-0-pcx3bt21i-abhishek-yadavs-projects-c0d518dd.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }

    },
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(cookieParser());

// ✅ HEALTH CHECK ROUTE - Add this
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ ROOT ROUTE - Optional but good to have
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'ClassNexus API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/v1/users',
      courses: '/api/v1/courses',
      students: '/api/v1/students',
      payments: '/api/v1/pay',
      upload: '/api/v1/upload',
      certificate: '/api/v1/certificate'
    }
  });
});

import userRouter from "./routes/user.router.js"
import coursesRouter from "./routes/course.router.js"
import studentsRouter from "./routes/student.router.js"
import paymentRouter from "./routes/payment.router.js"
import upload from "./routes/upload.routes.js"
import certificate from "./routes/certificate.routes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/pay", paymentRouter);
app.use("/api/v1/upload", upload);
app.use("/api/v1/certificates", certificate);

app.use('/*splat', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;