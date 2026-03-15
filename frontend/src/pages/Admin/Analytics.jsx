import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"

const Analytics = () => {
  const enrollmentData = [
    { month: "Jan", students: 40 },
    { month: "Feb", students: 60 },
    { month: "Mar", students: 80 },
    { month: "Apr", students: 120 },
    { month: "May", students: 150 },
  ]

  const courseData = [
    { course: "Web Dev", students: 120 },
    { course: "Python", students: 90 },
    { course: "Data Science", students: 70 },
    { course: "AI/ML", students: 40 },
  ]

  const statusData = [
    { name: "Active", value: 280 },
    { name: "Inactive", value: 40 },
  ]

  const COLORS = ["#2563eb", "#dc2626"]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* 🔢 Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Students" value="320" />
        <Card title="Active Students" value="280" />
        <Card title="Total Courses" value="12" />
        <Card title="Certificates Issued" value="180" />
      </div>

      {/* 📈 Enrollment Trend */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="font-semibold mb-4">Monthly Enrollments</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={enrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Bar + 🥧 Pie */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Course Distribution */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Students per Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="course" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Status */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Student Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const Card = ({ title, value }) => (
  <div className="bg-white p-5 rounded shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
)

export default Analytics
