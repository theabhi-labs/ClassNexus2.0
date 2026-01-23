import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminLayout from "../pages/Admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Courses from "../pages/Admin/Courses";
import Analytics from "../pages/Admin/Analytics";
import StudentProfile from "../pages/Students/StudentProfile";
import Payment from "../pages/Admin/Payment";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/students" element={<StudentProfile />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="payments" element={<Payment />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
