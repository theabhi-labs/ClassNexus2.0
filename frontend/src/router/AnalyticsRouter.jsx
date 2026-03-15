import React from 'react'
import {Routes, Route} from "react-router-dom"
import Analytics from "../pages/Admin/Analytics"

export default function AnalyticsRouter() {
  return (
    <Routes>
      <Route element={<Analytics/>}/>
    </Routes>
  )
}


