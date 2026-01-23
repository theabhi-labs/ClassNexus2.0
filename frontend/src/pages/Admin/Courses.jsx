import { useState } from "react"

const Courses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Web Development",
      instructor: "Amit Sir",
      price: 4999,
      students: 120,
      status: "Active",
    },
    {
      id: 2,
      title: "Python Programming",
      instructor: "Neha Ma'am",
      price: 3999,
      students: 90,
      status: "Inactive",
    },
  ])

  const [search, setSearch] = useState("")
  const [form, setForm] = useState({
    title: "",
    instructor: "",
    price: "",
    status: "Active",
  })
  const [editingId, setEditingId] = useState(null)

  // 🔍 Search Filter
  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
  )

  // ➕ Add / ✏️ Update Course
  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      setCourses(
        courses.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...form,
                price: Number(form.price),
              }
            : c
        )
      )
      setEditingId(null)
    } else {
      setCourses([
        ...courses,
        {
          id: Date.now(),
          ...form,
          students: 0,
          price: Number(form.price),
        },
      ])
    }

    setForm({
      title: "",
      instructor: "",
      price: "",
      status: "Active",
    })
  }

  // ✏️ Edit
  const handleEdit = (course) => {
    setForm({
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      status: course.status,
    })
    setEditingId(course.id)
  }

  // 🗑 Delete
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Courses Management</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-4 py-2 rounded w-full md:w-1/3"
      />

      {/* ➕ Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-5 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          required
          type="text"
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          required
          type="text"
          placeholder="Instructor"
          value={form.instructor}
          onChange={(e) => setForm({ ...form, instructor: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          required
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          {editingId ? "Update" : "Add"} Course
        </button>
      </form>

      {/* 📋 Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Course</th>
              <th className="p-3">Instructor</th>
              <th className="p-3">Price</th>
              <th className="p-3">Students</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{c.title}</td>
                <td className="p-3">{c.instructor}</td>
                <td className="p-3">₹{c.price}</td>
                <td className="p-3">{c.students}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCourses.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No courses found
          </p>
        )}
      </div>
    </div>
  )
}

export default Courses

