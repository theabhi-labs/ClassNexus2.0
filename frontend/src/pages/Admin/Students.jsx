import { useState } from "react"

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      course: "Web Development",
      joined: "2025-01-10",
    },
    {
      id: 2,
      name: "Anjali Verma",
      email: "anjali@gmail.com",
      course: "Python",
      joined: "2025-01-15",
    },
  ])

  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
  })
  const [editingId, setEditingId] = useState(null)

  // 🔍 Search Filter
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  // ➕ Add / ✏️ Update Student
  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      setStudents(
        students.map((s) =>
          s.id === editingId ? { ...s, ...form } : s
        )
      )
      setEditingId(null)
    } else {
      setStudents([
        ...students,
        {
          id: Date.now(),
          ...form,
          joined: new Date().toISOString().slice(0, 10),
        },
      ])
    }

    setForm({ name: "", email: "", course: "" })
  }

  // ✏️ Edit
  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
    })
    setEditingId(student.id)
  }

  // 🗑 Delete
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      setStudents(students.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Students Management</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-full md:w-1/3"
      />

      {/* ➕ Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-4 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          required
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          required
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"} Student
        </button>
      </form>

      {/* 📋 Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.course}</td>
                <td className="p-3">{s.joined}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No students found
          </p>
        )}
      </div>
    </div>
  )
}

export default Students
