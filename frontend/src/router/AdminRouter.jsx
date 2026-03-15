import React from 'react'
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/Admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import CoursesRouter from "./CoursesRouter";
import AnalyticsRouter from "./AnalyticsRouter";
import PaymentRouter from "./Payment";

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<CoursesRouter />} />
        <Route path="analytics" element={<AnalyticsRouter />} />
        <Route path="payments" element={<PaymentRouter />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
