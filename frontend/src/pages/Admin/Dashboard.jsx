import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // Metrics Cards
  const metrics = [
    { title: "Total Students", value: 120, color: "bg-blue-500" },
    { title: "Total Courses", value: 12, color: "bg-green-500" },
    { title: "Certificates Issued", value: 95, color: "bg-yellow-500" },
    { title: "Active Faculty", value: 10, color: "bg-purple-500" },
  ];

  // Sample chart data
  const studentGrowth = [
    { month: "Jan", students: 20 },
    { month: "Feb", students: 35 },
    { month: "Mar", students: 50 },
    { month: "Apr", students: 65 },
    { month: "May", students: 80 },
    { month: "Jun", students: 95 },
  ];

  const courseEnrollments = [
    { name: "Web Dev", students: 30 },
    { name: "Python", students: 25 },
    { name: "AI/ML", students: 20 },
    { name: "Java", students: 15 },
    { name: "C Programming", students: 10 },
  ];

  // Recent Enrollments
  const recentEnrollments = [
    { name: "Abhishek Yadav", course: "Web Development", date: "22 Jan 2026" },
    { name: "Riya Sharma", course: "Python", date: "21 Jan 2026" },
    { name: "Vikram Singh", course: "AI/ML", date: "20 Jan 2026" },
    { name: "Sneha Gupta", course: "Java", date: "19 Jan 2026" },
  ];

  // Latest Activity
  const latestActivity = [
    { activity: "Certificate issued to Abhishek Yadav", time: "2h ago" },
    { activity: "New course 'React JS' added", time: "5h ago" },
    { activity: "Student Riya Sharma enrolled in Python", time: "1d ago" },
    { activity: "Faculty profile updated: Vikram Singh", time: "2d ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className={`p-6 rounded-lg shadow-md text-white ${metric.color}`}
          >
            <div className="text-sm font-medium">{metric.title}</div>
            <div className="mt-2 text-2xl font-bold">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Student Growth */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Student Growth (Monthly)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={studentGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="students"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Course Enrollments */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Course Enrollments</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseEnrollments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Enrollments & Latest Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Enrollments</h2>
          <ul className="space-y-2">
            {recentEnrollments.map((enroll, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span>{enroll.name} → {enroll.course}</span>
                <span className="text-gray-500 text-sm">{enroll.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Latest Activity */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Latest Activity</h2>
          <ul className="space-y-2">
            {latestActivity.map((act, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <span>{act.activity}</span>
                <span className="text-gray-500 text-sm">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
