import React from 'react'
import { useState } from "react";

const initialStudents = [
  {
    id: 1,
    name: "Rahul Kumar",
    rollNo: "AKTU2025-101",
    course: "Web Development",
    status: "IN_PROGRESS",
    certificateIssued: false,
  },
  {
    id: 2,
    name: "Amit Sharma",
    rollNo: "AKTU2025-102",
    course: "Python",
    status: "COMPLETED",
    certificateIssued: true,
  },
];

const Certificates = () => {
  const [students, setStudents] = useState(initialStudents);

  const markCompleted = (id) => {
    setStudents(
      students.map((s) =>
        s.id === id
          ? { ...s, status: "COMPLETED", certificateIssued: true }
          : s
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Certificates Management</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Roll No</th>
              <th className="p-3">Course</th>
              <th className="p-3">Status</th>
              <th className="p-3">Certificate</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.rollNo}</td>
                <td className="p-3">{s.course}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      s.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3">
                  {s.certificateIssued ? "Issued ✅" : "Not Issued ❌"}
                </td>
                <td className="p-3">
                  {s.status !== "COMPLETED" && (
                    <button
                      onClick={() => markCompleted(s.id)}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Complete & Issue
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Certificates;
