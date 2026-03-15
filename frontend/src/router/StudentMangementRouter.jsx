import React from 'react'
import {Routes, Route} from "react-router-dom"
import Students from "../pages/Admin/Students"

export default function StudentManagmentRouter() {
  return (
    <Routes>
      <Route element={<Students/>}/>
    </Routes>
  )
}