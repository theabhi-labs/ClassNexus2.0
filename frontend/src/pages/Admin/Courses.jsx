import React, { useEffect, useState, useRef } from "react";
import {
  Search, Plus, Edit2, Trash2, Clock, Loader2, X, Wand2,
  BookOpen, Briefcase, Zap, Award, Globe, Users, Wifi,
  ChevronDown, ChevronUp, Save, AlertCircle, CheckCircle,
  Layers, Target, FileText, Tag, DollarSign, Calendar
} from "lucide-react";
import {
  getCourses, addCourse, updateCourse, deleteCourse,
} from "../../api/courses.api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedSyllabus, setExpandedSyllabus] = useState({});

  const formRef = useRef(null);

  // Default form state with all fields
const defaultForm = {
  title: "",
  thumbnail: "",
  shortDescription: "",
  description: "",
  price: "",
  duration: { value: "", unit: "months" },
  level: "Beginner",
  language: "English",
  mode: "Online",
  certificateProvided: false,
  projectsIncluded: 0,
  maxStudents: "",
  skillsYouLearn: [],
  careerOpportunities: [],
  syllabus: [{ title: "", topics: [""] }]
};

  const [form, setForm] = useState(defaultForm);
  const [skillInput, setSkillInput] = useState("");
  const [careerInput, setCareerInput] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data?.data || []);
    } catch (err) {
      showError("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Show success message
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (message) => {
    setErrors({ general: message });
    setTimeout(() => setErrors({}), 3000);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.thumbnail.trim()) newErrors.thumbnail = "Thumbnail URL is required";
    if (!form.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.duration.value || form.duration.value <= 0) newErrors.duration = "Duration is required";
    if (!form.maxStudents || form.maxStudents <= 0) newErrors.maxStudents = "Max students is required";

    // Validate syllabus
    const invalidModules = form.syllabus.filter(m => !m.title.trim());
    if (invalidModules.length > 0) newErrors.syllabus = "All modules need titles";

    form.syllabus.forEach((module, idx) => {
      const invalidTopics = module.topics.filter(t => !t.trim());
      if (invalidTopics.length > 0) {
        newErrors[`syllabus_${idx}`] = "All topics need content";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Tag handlers
  const addTag = (e, field, value, setter) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        setForm(prev => ({
          ...prev,
          [field]: prev[field].includes(trimmed) ? prev[field] : [...prev[field], trimmed]
        }));
        setter("");
      }
    }
  };

  const removeTag = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Syllabus handlers
  const addModule = () => {
    setForm(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { title: "", topics: [""] }]
    }));
  };

  const removeModule = (index) => {
    if (form.syllabus.length > 1) {
      setForm(prev => ({
        ...prev,
        syllabus: prev.syllabus.filter((_, i) => i !== index)
      }));
    }
  };

  const addTopic = (moduleIndex) => {
    setForm(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) =>
        i === moduleIndex
          ? { ...module, topics: [...module.topics, ""] }
          : module
      )
    }));
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    setForm(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) =>
        i === moduleIndex && module.topics.length > 1
          ? { ...module, topics: module.topics.filter((_, j) => j !== topicIndex) }
          : module
      )
    }));
  };

  const updateModuleTitle = (index, value) => {
    setForm(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) =>
        i === index ? { ...module, title: value } : module
      )
    }));
  };

  const updateTopic = (moduleIndex, topicIndex, value) => {
    setForm(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) =>
        i === moduleIndex
          ? {
            ...module,
            topics: module.topics.map((topic, j) =>
              j === topicIndex ? value : topic
            )
          }
          : module
      )
    }));
  };

  const toggleSyllabusExpand = (index) => {
    setExpandedSyllabus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Prepare payload for backend
    const payload = {
      title: form.title,
      thumbnail: form.thumbnail,
      price: Number(form.price),
      duration: { ...form.duration, value: Number(form.duration.value) },
      level: form.level || "Beginner",
      language: form.language || "Hindi",
      mode: form.mode || "Offline",
      certificateProvided: typeof form.certificateProvided === "boolean" ? form.certificateProvided : true,
      projectsIncluded: Number(form.projectsIncluded),
      maxStudents: Number(form.maxStudents),
      shortDescription: form.shortDescription,
      description: form.description,
      skillsYouLearn: form.skillsYouLearn.filter(s => s.trim()),
      careerOpportunities: form.careerOpportunities.filter(c => c.trim()),
      syllabus: (form.syllabus || [])
        .filter(m => m.title?.trim())
        .map(m => ({ title: m.title.trim(), topics: (m.topics || []).filter(t => t.trim()) }))
    };

    console.log("DEBUG: Payload to send:", payload);

    try {
      if (editingId) {
        await updateCourse(editingId, payload);
        showSuccess("Course updated successfully!");
      } else {
        await addCourse(payload);
        showSuccess("Course created successfully!");
      }
      handleCancel();
      await fetchCourses();
    } catch (err) {
      showError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit handler
const handleEdit = (course) => {
  setEditingId(course._id);

  setForm({
    title: course.title || "",
    thumbnail: course.thumbnail || "",
    shortDescription: course.shortDescription || "",
    description: course.description || "",
    price: course.price || "",
    duration: course.duration || { value: "", unit: "months" },

    level: course.level || "Beginner",
    language: course.language || "English",
    mode: course.mode || "Online",

    certificateProvided: course.certificateProvided ?? true,
    projectsIncluded: course.projectsIncluded || 0,
    maxStudents: course.maxStudents || "",

    skillsYouLearn: course.skillsYouLearn || [],
    careerOpportunities: course.careerOpportunities || [],

    syllabus:
      course.syllabus?.length
        ? course.syllabus
        : [{ title: "", topics: [""] }],
  });

  formRef.current?.scrollIntoView({ behavior: "smooth" });
};
  const handleCancel = () => {
    setEditingId(null);
    setForm(defaultForm);
    setSkillInput("");
    setCareerInput("");
    setErrors({});
    setExpandedSyllabus({});
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Get level badge color
  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700',
      'Intermediate': 'bg-yellow-100 text-yellow-700',
      'Advanced': 'bg-red-100 text-red-700',
      'All Levels': 'bg-purple-100 text-purple-700'
    };
    return colors[level] || 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Course Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create and manage your courses with syllabus and learning outcomes
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search courses by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
          {errors.general && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{errors.general}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8">

          {/* LEFT: Courses Table */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Course Details</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <Loader2 className="animate-spin mx-auto text-indigo-500" size={32} />
                          <p className="text-sm text-slate-500 mt-2">Loading courses...</p>
                        </td>
                      </tr>
                    ) : filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-20 text-center">
                          <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
                          <p className="text-sm text-slate-500">No courses found</p>
                          <button
                            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                            className="mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700"
                          >
                            Create your first course →
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={course.thumbnail || "https://via.placeholder.com/400x300?text=No+Image"}
                                className="h-14 w-14 rounded-lg object-cover bg-slate-100 border border-slate-200"
                                alt={course.title}
                                onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=Error"}
                              />
                              <div>
                                <div className="font-bold text-slate-900 mb-1">
                                  {course.title}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="flex items-center text-slate-500">
                                    <Clock size={12} className="mr-1" />
                                    {course.duration?.value} {course.duration?.unit}
                                  </span>
                                  <span className={`${getLevelColor(course.level)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                                    {course.level || "All Levels"}
                                  </span>
                                  {course.certificateProvided && (
                                    <span className="flex items-center text-amber-600" title="Certificate Included">
                                      <Award size={12} />
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">₹{course.price?.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                              }`}>
                              {course.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(course)}
                                className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                                title="Edit course"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm("Are you sure you want to delete this course?")) {
                                    try {
                                      await deleteCourse(course._id);
                                      await fetchCourses();
                                      showSuccess("Course deleted successfully!");
                                    } catch (err) {
                                      showError("Failed to delete course");
                                    }
                                  }
                                }}
                                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                title="Delete course"
                              >
                                <Trash2 size={16} />
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

          {/* RIGHT: Course Form */}
          <div className="lg:col-span-5" ref={formRef}>
            <div className="sticky top-8 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-bold flex items-center gap-2 text-lg">
                      {editingId ? <Wand2 size={20} /> : <Plus size={20} />}
                      {editingId ? "Edit Course" : "Create New Course"}
                    </h2>
                    <p className="text-indigo-100 text-xs mt-1">
                      {editingId ? "Update course details" : "Fill in the course information"}
                    </p>
                  </div>
                  {editingId && (
                    <button
                      onClick={handleCancel}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      title="Cancel editing"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Layers size={14} /> Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Course Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      placeholder="e.g., Advanced JavaScript Mastery"
                      value={form.title}
                      onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                      className={`w-full rounded-lg border p-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.title ? 'border-red-500 bg-red-50' : 'border-slate-200'
                        }`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Thumbnail URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      placeholder="https://example.com/image.jpg"
                      value={form.thumbnail}
                      onChange={(e) => setForm(p => ({ ...p, thumbnail: e.target.value }))}
                      className={`w-full rounded-lg border p-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.thumbnail ? 'border-red-500 bg-red-50' : 'border-slate-200'
                        }`}
                    />
                    {errors.thumbnail && <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="2999"
                          value={form.price}
                          onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
                          className={`w-full rounded-lg border pl-9 p-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.price ? 'border-red-500 bg-red-50' : 'border-slate-200'
                            }`}
                        />
                      </div>
                      {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Max Students <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="50"
                          value={form.maxStudents}
                          onChange={(e) => setForm(p => ({ ...p, maxStudents: e.target.value }))}
                          className={`w-full rounded-lg border pl-9 p-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.maxStudents ? 'border-red-500 bg-red-50' : 'border-slate-200'
                            }`}
                        />
                      </div>
                      {errors.maxStudents && <p className="text-red-500 text-xs mt-1">{errors.maxStudents}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Duration <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="3"
                          value={form.duration.value}
                          onChange={(e) => setForm(p => ({ ...p, duration: { ...p.duration, value: e.target.value } }))}
                          className={`w-20 rounded-lg border p-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.duration ? 'border-red-500 bg-red-50' : 'border-slate-200'
                            }`}
                        />
                        <select
                          value={form.duration.unit}
                          onChange={(e) => setForm(p => ({ ...p, duration: { ...p.duration, unit: e.target.value } }))}
                          className="flex-1 rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                      {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Projects Included
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="4"
                        value={form.projectsIncluded}
                        onChange={(e) => setForm(p => ({ ...p, projectsIncluded: e.target.value }))}
                        className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Target size={14} /> Course Details
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                      <select
                        value={form.level}
                        onChange={(e) => setForm(p => ({ ...p, level: e.target.value }))}
                        className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                      <select
                        value={form.language}
                        onChange={(e) => setForm(p => ({ ...p, language: e.target.value }))}
                        className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                        <option value="Marathi">Marathi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mode</label>
                      <select
                        value={form.mode}
                        onChange={(e) => setForm(p => ({ ...p, mode: e.target.value }))}
                        className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.certificateProvided}
                          onChange={(e) => setForm(p => ({ ...p, certificateProvided: e.target.checked }))}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Certificate Provided</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> Descriptions
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      placeholder="Brief overview of the course (max 200 characters)"
                      rows={2}
                      maxLength={200}
                      value={form.shortDescription}
                      onChange={(e) => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                      className={`w-full rounded-lg border p-3 text-sm outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.shortDescription ? 'border-red-500 bg-red-50' : 'border-slate-200'
                        }`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.shortDescription && <p className="text-red-500 text-xs">{errors.shortDescription}</p>}
                      <p className="text-xs text-slate-400 ml-auto">{form.shortDescription.length}/200</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      placeholder="Detailed course description, prerequisites, what students will learn..."
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                      className={`w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${errors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                        }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>
                </div>

                {/* Skills You Learn */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                    <Zap size={14} /> Skills You'll Learn
                  </h3>

                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {form.skillsYouLearn.length === 0 ? (
                      <p className="text-sm text-slate-400">No skills added yet. Add skills below.</p>
                    ) : (
                      form.skillsYouLearn.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-indigo-200 shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeTag('skillsYouLearn', i)}
                            className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Add Skills (Press Enter or comma to add)
                    </label>
                    <input
                      placeholder="e.g., React, Node.js, MongoDB..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => addTag(e, 'skillsYouLearn', skillInput, setSkillInput)}
                      className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Career Opportunities */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={14} /> Career Opportunities
                  </h3>

                  <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {form.careerOpportunities.length === 0 ? (
                      <p className="text-sm text-slate-400">No career paths added yet.</p>
                    ) : (
                      form.careerOpportunities.map((career, i) => (
                        <span
                          key={i}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-emerald-200 shadow-sm"
                        >
                          {career}
                          <button
                            type="button"
                            onClick={() => removeTag('careerOpportunities', i)}
                            className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Add Career Roles (Press Enter or comma to add)
                    </label>
                    <input
                      placeholder="e.g., Frontend Developer, Full Stack Engineer..."
                      value={careerInput}
                      onChange={(e) => setCareerInput(e.target.value)}
                      onKeyDown={(e) => addTag(e, 'careerOpportunities', careerInput, setCareerInput)}
                      className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                {/* Syllabus - Modules and Topics */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={14} /> Course Syllabus
                    </h3>
                    <button
                      type="button"
                      onClick={addModule}
                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium hover:bg-purple-200 transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Module
                    </button>
                  </div>

                  {errors.syllabus && (
                    <p className="text-red-500 text-xs">{errors.syllabus}</p>
                  )}

                  <div className="space-y-3">
                    {form.syllabus.map((module, moduleIndex) => (
                      <div
                        key={moduleIndex}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
                      >
                        {/* Module Header */}
                        <div
                          className="bg-slate-50 p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => toggleSyllabusExpand(moduleIndex)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {moduleIndex + 1}
                            </span>
                            <input
                              placeholder="Module title (e.g., Introduction to React)"
                              value={module.title}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)}
                              className={`flex-1 bg-transparent border-0 p-1 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 rounded ${errors[`syllabus_${moduleIndex}`] ? 'text-red-600' : ''
                                }`}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            {form.syllabus.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeModule(moduleIndex);
                                }}
                                className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded transition-colors"
                                title="Remove module"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                            <button
                              type="button"
                              className="p-1 hover:bg-slate-200 rounded transition-colors"
                            >
                              {expandedSyllabus[moduleIndex] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Module Topics */}
                        {expandedSyllabus[moduleIndex] && (
                          <div className="p-4 space-y-3">
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-slate-500">Topics</label>
                              {module.topics.map((topic, topicIndex) => (
                                <div key={topicIndex} className="flex gap-2">
                                  <input
                                    placeholder={`Topic ${topicIndex + 1}`}
                                    value={topic}
                                    onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                                    className="flex-1 rounded-lg border p-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                  />
                                  {module.topics.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTopic(moduleIndex, topicIndex)}
                                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => addTopic(moduleIndex)}
                              className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                            >
                              <Plus size={12} /> Add Topic
                            </button>

                            {errors[`syllabus_${moduleIndex}`] && (
                              <p className="text-red-500 text-xs">{errors[`syllabus_${moduleIndex}`]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingId ? "Update Course" : "Create Course"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;

