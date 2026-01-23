import { useState } from "react";

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    experience: "",
    about: "",
    photo: "",
  });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.experience) return;

    if (editId) {
      setFacultyList(
        facultyList.map((f) =>
          f.id === editId ? { ...form, id: editId } : f
        )
      );
      setEditId(null);
    } else {
      setFacultyList([...facultyList, { ...form, id: Date.now() }]);
    }

    setForm({ name: "", experience: "", about: "", photo: "" });
  };

  const handleEdit = (faculty) => {
    setForm(faculty);
    setEditId(faculty.id);
  };

  const handleDelete = (id) => {
    setFacultyList(facultyList.filter((f) => f.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Faculty Management</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Faculty Name"
            value={form.name}
            onChange={handleChange}
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="experience"
            placeholder="Experience (e.g. 5 Years)"
            value={form.experience}
            onChange={handleChange}
            className="border p-3 rounded"
          />
        </div>

        <input
          type="text"
          name="photo"
          placeholder="Photo URL"
          value={form.photo}
          onChange={handleChange}
          className="border p-3 rounded w-full"
        />

        <textarea
          name="about"
          placeholder="About Faculty"
          value={form.about}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          rows="3"
        />

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          {editId ? "Update Faculty" : "Add Faculty"}
        </button>
      </form>

      {/* Faculty Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Name</th>
              <th className="p-3">Experience</th>
              <th className="p-3">About</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facultyList.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No faculty added yet
                </td>
              </tr>
            )}

            {facultyList.map((faculty) => (
              <tr key={faculty.id} className="border-t">
                <td className="p-3">
                  {faculty.photo ? (
                    <img
                      src={faculty.photo}
                      alt={faculty.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 font-medium">{faculty.name}</td>
                <td className="p-3">{faculty.experience}</td>
                <td className="p-3 text-sm text-gray-600">
                  {faculty.about}
                </td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => handleEdit(faculty)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faculty.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faculty;
