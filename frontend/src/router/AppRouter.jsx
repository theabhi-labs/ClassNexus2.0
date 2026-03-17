// router/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
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
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/rotectedRoute';

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Student Profile - Only accessible by the student or admin */}
      <Route 
        path="/profile/:id" 
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* Public Course Routes */}
      <Route path="/courses" element={<PublicCourses />} /> 
      <Route path="/courses/:courseId" element={<PublicCourseDetail />} />
      <Route path="/faculty" element={<PublicFaculty/>} />  
      
      {/* Certificate Portal - Public Access */}
      <Route path="/certificate" element={<CertificatePortal />} />
      <Route path="/certificate-portal" element={<Navigate to="/certificate" replace />} />
      <Route path="/verify-certificate" element={<Navigate to="/certificate" replace />} />

      {/* ========== PROTECTED ADMIN ROUTES ========== */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="payments" element={<Payment />} />
        <Route path="students" element={<Students />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirect if already logged in */}
      <Route 
        path="/auth-redirect" 
        element={user ? <Navigate to="/" /> : <Navigate to="/login" />} 
      />

      {/* ========== 404 - NOT FOUND ========== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;


