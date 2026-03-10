import { Routes, Route } from "react-router-dom";
import Courses from "../components/Courses";
import CourseDetailPage from "../components/courses/CourseDetailPage";

export default function CoursesRouter() {
  return (
    <Routes>
      <Route path="/" element={<Courses />} />
      <Route path=":courseId" element={<CourseDetailPage />} />
    </Routes>
  );
}
