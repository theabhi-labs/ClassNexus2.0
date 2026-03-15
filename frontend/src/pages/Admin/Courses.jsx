import React from 'react'
import { useEffect, useState, useRef } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Clock,
  Loader2,
  X,
} from "lucide-react";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../../api/courses.api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef(null);

  const defaultForm = {
    title: "",
    thumbnail: "",
    shortDescription: "",
    description: "",
    price: "",
    duration: { value: "", unit: "months" },
  };

  const [form, setForm] = useState(defaultForm);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateCourse(editingId, form);
      } else {
        await addCourse(form);
      }
      handleCancel();
      await fetchCourses();
    } catch (err) {
      console.error("Course save failed:", err);
      alert("Operation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title || "",
      thumbnail: course.thumbnail || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      price: course.price || "",
      duration: course.duration || { value: "", unit: "months" },
    });
    // Scroll to form on mobile
    if (window.innerWidth < 1024) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course.");
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Course Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, update, and manage your educational content.
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT: Course Table (Takes 8 columns) */}
          <div className="lg:col-span-8 mt-8 lg:mt-0">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                  All Courses
                  <span className="ml-2 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {filteredCourses.length}
                  </span>
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Course</th>
                      <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Duration</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-24 text-center">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500 mb-4" />
                          <p className="text-sm text-slate-500">Loading your courses...</p>
                        </td>
                      </tr>
                    ) : filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-24 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                            <BookOpen className="h-6 w-6 text-slate-400" />
                          </div>
                          <p className="text-base font-medium text-slate-900">No courses found</p>
                          <p className="text-sm text-slate-500 mt-1">
                            {search ? "Try adjusting your search query." : "Get started by creating a new course."}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course) => (
                        <tr key={course._id} className="transition-colors hover:bg-slate-50 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt="" className="h-10 w-10 `flex-shrink-0` rounded-lg object-cover border border-slate-200" />
                              ) : (
                                <div className="flex h-10 w-10 `flex-shrink-0` items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{course.title}</div>
                                <div className="text-xs text-slate-500 line-clamp-1 `max-w-[200px]`">{course.shortDescription || "No description"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-6 py-4 md:table-cell">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                              <Clock className="h-3 w-3" />
                              {course.duration?.value || "—"} {course.duration?.unit || ""}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">
                              ₹{Number(course.price || 0).toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(course)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                title="Edit Course"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete Course"
                              >
                                <Trash2 className="h-4 w-4" />
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
          </div>

          {/* RIGHT: Form Sticky Sidebar (Takes 4 columns) */}
          <div className="lg:col-span-4" ref={formRef}>
            <div className="sticky top-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-800">
                  {editingId ? "Edit Course" : "Create New Course"}
                </h2>
                {editingId && (
                  <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Course Title *</label>
                  <input
                    id="title"
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="e.g. Advanced React Patterns"
                  />
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
                  <input
                    id="thumbnail"
                    type="url"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                  <input
                    id="shortDescription"
                    type="text"
                    value={form.shortDescription}
                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Brief 1-line summary"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
                  <textarea
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                    placeholder="What will students learn?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                    <input
                      id="price"
                      required
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      placeholder="2499"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="durationValue" className="block text-sm font-medium text-slate-700 mb-1 text-truncate">Duration *</label>
                      <input
                        id="durationValue"
                        required
                        type="number"
                        min="1"
                        value={form.duration.value}
                        onChange={(e) => setForm({ ...form, duration: { ...form.duration, value: e.target.value } })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        placeholder="6"
                      />
                    </div>
                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-slate-700 mb-1">&nbsp;</label>
                      <select
                        id="unit"
                        value={form.duration.unit}
                        onChange={(e) => setForm({ ...form, duration: { ...form.duration, unit: e.target.value } })}
                        className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                      >
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all
                      ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingId ? (
                      <Edit2 className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;

