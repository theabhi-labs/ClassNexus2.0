import {Routes, Route} from "react-router-dom"
import Courses from "../pages/Admin/Courses"

export default function CoursesRouter() {
  return (
    <Routes>
      <Route element={<Courses/>}/>
    </Routes>
  )
}
