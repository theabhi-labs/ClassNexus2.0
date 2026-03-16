import React, { useState } from "react";
import { UserPlus, Edit3, Trash2, Camera, Briefcase, Info, Save, GraduationCap } from "lucide-react";

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setFacultyList(facultyList.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* ─── Header Section ─── */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Directory</h2>
          <p className="text-sm text-slate-500 font-medium">Manage your educators and academic experts.</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {facultyList.length} Members
          </div>
        </div>
      </div>

      {/* ─── Add/Edit Faculty Form ─── */}
      <section className={`bg-white p-8 rounded-[32px] border transition-all duration-300 ${editId ? 'border-[#4F46E5] ring-4 ring-[#4F46E5]/5' : 'border-slate-200/60 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-lg ${editId ? 'bg-[#4F46E5] text-white' : 'bg-slate-100 text-slate-600'}`}>
            {editId ? <Edit3 size={18} /> : <UserPlus size={18} />}
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {editId ? "Refine Faculty Details" : "Architect New Faculty"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <GraduationCap size={14} /> Full Name
              </label>
              <input
                name="name"
                placeholder="Dr. Arjun Singh"
                value={form.name}
                onChange={handleChange}
                className="industrial-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Briefcase size={14} /> Experience Level
              </label>
              <input
                name="experience"
                placeholder="12+ Years Experience"
                value={form.experience}
                onChange={handleChange}
                className="industrial-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Camera size={14} /> Profile Image URL
            </label>
            <input
              name="photo"
              placeholder="https://images.unsplash.com/..."
              value={form.photo}
              onChange={handleChange}
              className="industrial-input"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Info size={14} /> Professional Bio
            </label>
            <textarea
              name="about"
              placeholder="Write a short summary about the faculty's expertise..."
              value={form.about}
              onChange={handleChange}
              className="industrial-input min-h-[100px] resize-none"
            />
          </div>

          <button className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95">
            <Save size={16} />
            {editId ? "Synchronize Updates" : "Deploy Faculty Profile"}
          </button>
        </form>
      </section>

      {/* ─── Faculty Table ─── */}
      <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Identity</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Experience</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Background</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {facultyList.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 font-bold italic">
                  No educators architected yet.
                </td>
              </tr>
            ) : (
              facultyList.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200">
                        {faculty.photo ? (
                          <img src={faculty.photo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-black">
                            {faculty.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-900 tracking-tight">{faculty.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase">
                      {faculty.experience}
                    </span>
                  </td>
                  <td className="p-6 max-w-xs">
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{faculty.about}</p>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(faculty)}
                        className="p-2.5 text-slate-400 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(faculty.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faculty;