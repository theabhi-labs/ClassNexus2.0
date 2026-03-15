import React from 'react'
import {Routes, Route} from "react-router-dom"
import StudentProfile from "../pages/Students/StudentProfile"

const StudentsRouter=()=>{
    return(
        <Routes>
            <Route element={<StudentProfile/>}/>
        </Routes>
    )
}

export default StudentsRouter