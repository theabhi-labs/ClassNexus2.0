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


const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden" 
       style={{ background: 'radial-gradient(circle at top right, #eef2ff, #ffffff, #f5f3ff)' }}>
    
    {/* --- Animated Background Shapes (Bina config ke animation ke liye inline styles) --- */}
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

    <div className="max-w-3xl w-full text-center relative z-10">
      
      {/* --- 404 Illustration Section --- */}
      <div className="relative mb-12 flex justify-center items-center">
        {/* Layered Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl border border-indigo-200/20"></div>
        </div>
        
        <div className="relative group">
          <h1 className="text-[10rem] md:text-[13rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 via-indigo-700 to-purple-800 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-2 select-none">
            404
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-indigo-900/10 blur-xl rounded-full"></div>
        </div>
      </div>

      {/* --- Main Message Section --- */}
      <div className="space-y-6 mb-12 px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          🎯 Motivation <span className="text-indigo-600 inline-block hover:scale-105 transition-transform duration-300">Not Found</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium italic">
          "The motivation you're looking for is not here, 
          <span className="block text-indigo-700 font-bold mt-3 not-italic bg-indigo-50 py-1 px-4 rounded-lg inline-block">
            but your next big achievement is just a click away!
          </span>
        </p>
      </div>

      {/* --- Premium Quotes Cards (Using Glassmorphism) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4">
        {[
          { icon: "📚", text: "Keep learning, keep growing" },
          { icon: "🚀", text: "Your journey continues here" },
          { icon: "💡", text: "Every mistake is a lesson" },
        ].map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-200/50 hover:-translate-y-4"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-5xl mb-4 block transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{item.icon}</span>
            <p className="text-sm font-bold text-slate-700 leading-snug">{item.text}</p>
          </div>
        ))}
      </div>

      {/* --- Action Buttons (High Contrast & Feedback) --- */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center px-6">
        <a
          href="/"
          className="group relative w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-slate-950 text-white font-bold rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-indigo-500/25"
        >
          {/* Animated Gradient Background on Hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span className="relative flex items-center gap-3 text-lg">
            <svg className="w-6 h-6 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </span>
        </a>

        <button
          onClick={() => window.history.back()}
          className="group w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-white text-indigo-700 font-bold rounded-2xl border-2 border-indigo-100 shadow-xl transition-all duration-300 hover:border-indigo-600 hover:shadow-indigo-100 active:scale-95"
        >
          <span className="relative flex items-center gap-3 text-lg">
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </span>
        </button>
      </div>

      {/* --- Premium Footer --- */}
      <div className="mt-20 pt-10 border-t border-slate-200/60 max-w-lg mx-auto">
        <p className="text-sm font-bold text-slate-400 tracking-wider uppercase flex items-center justify-center gap-3">
          <span className="w-8 h-[1px] bg-slate-200"></span>
          Remember: Every great student was once a beginner who never gave up! 🌟
          <span className="w-8 h-[1px] bg-slate-200"></span>
        </p>
      </div>
    </div>
  </div>
);


export default AppRouter;
