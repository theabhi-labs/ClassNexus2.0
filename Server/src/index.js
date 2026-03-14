import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config()
import "./cronJob/createPaymentRecord.js"  // Note: "cornJob" ya "cronJob"? Typo check karo

const PORT = process.env.PORT || 8000  // Default port add karo

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Root: http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongodb connection error", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});