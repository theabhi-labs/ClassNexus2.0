import express from "express"
import { 
    getAllStudentPayments,
    setupPayment,
    updatePayment,
 } from "../controllers/enrollment.controller.js";

 const router = express.Router();
 router.post("/setupPayment",setupPayment);
 router.put("/update/:paymentId", updatePayment);
 router.get("/getAllStudentPayments",getAllStudentPayments);

 export default router;