import { Routes, Route } from "react-router-dom";
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

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile/:id" element={<StudentProfile />} />
      <Route path="/courses" element={<PublicCourses />} /> 
      <Route path="/courses/:courseId" element={<PublicCourseDetail />} />
      <Route path="/faculty" element={<PublicFaculty/>} />  


      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="payments" element={<Payment />} />
        <Route path="students" element={<Students />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
