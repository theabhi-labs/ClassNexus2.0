import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminLayout from "../pages/Admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Courses from "../pages/Admin/Courses";
import PublicCourses from "../components/Courses";
import PublicCourseDetail from "../components/courses/CourseDetailPage";
import Analytics from "../pages/Admin/Analytics";
import StudentProfile from "../pages/Students/StudentProfile";
import Payment from "../pages/Admin/Payment";
import Students from "../pages/Admin/Students";
import Settings from "../pages/Admin/Settings/Settings";
import PublicFaculty from "../components/Faculty";
import CertificatePortal from '../pages/CertificatePortal';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/profile/:id" element={<StudentProfile />} />
      <Route path="/courses" element={<PublicCourses />} /> 
      <Route path="/courses/:courseId" element={<PublicCourseDetail />} />
      <Route path="/faculty" element={<PublicFaculty/>} />  
      
      {/* New Certificate Portal Route */}
      <Route path="/certificate" element={<CertificatePortal />} />
      <Route path="/certificate-portal" element={<Navigate to="/certificate" replace />} />
      <Route path="/verify-certificate" element={<Navigate to="/certificate" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="payments" element={<Payment />} />
        <Route path="students" element={<Students />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 - Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Optional: 404 Component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <a href="/" className="inline-block mt-6 text-indigo-600 hover:text-indigo-800">
        Go back home
      </a>
    </div>
  </div>
);

export default AppRouter;
