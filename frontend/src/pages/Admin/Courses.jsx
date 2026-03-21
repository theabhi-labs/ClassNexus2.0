import React, { useEffect, useState } from "react";
import {
  Search, Plus, Edit2, Trash2, Clock, Loader2, X, Wand2,
  BookOpen, Briefcase, Zap, Award, Globe, Users, Wifi,
  ChevronDown, ChevronUp, Save, AlertCircle, CheckCircle,
  Layers, Target, FileText, Tag, DollarSign, Calendar,
  GraduationCap, TrendingUp, Eye, Filter, Download
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getCourses, addCourse, updateCourse, deleteCourse,
} from "../../api/courses.api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit, view
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const defaultForm = {
    title: "",
    thumbnail: "",
    shortDescription: "",
    description: "",
    price: "",
    duration: { value: "", unit: "months" },
    level: "Beginner",
    language: "Hindi",
    mode: "Offline",
    certificateProvided: true,
    projectsIncluded: 0,
    maxStudents: "",
    skillsYouLearn: [],
    careerOpportunities: [],
    syllabus: [{ title: "", topics: [""] }]
  };

  const [form, setForm] = useState(defaultForm);
  const [skillInput, setSkillInput] = useState("");
  const [careerInput, setCareerInput] = useState("");
  const [expandedSyllabus, setExpandedSyllabus] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await getCourses();
      setCourses(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode("create");
    setForm(defaultForm);
    setFormErrors({});
    setExpandedSyllabus({});
    setSkillInput("");
    setCareerInput("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (course) => {
    setModalMode("edit");
    setSelectedCourse(course);
    setForm({
      title: course.title || "",
      thumbnail: course.thumbnail || "",
      shortDescription: course.shortDescription || "",
      description: course.description || "",
      price: course.price || "",
      duration: course.duration || { value: "", unit: "months" },
      level: course.level || "Beginner",
      language: course.language || "Hindi",
      mode: course.mode || "Offline",
      certificateProvided: course.certificateProvided ?? true,
      projectsIncluded: course.projectsIncluded || 0,
      maxStudents: course.maxStudents || "",
      skillsYouLearn: course.skillsYouLearn || [],
      careerOpportunities: course.careerOpportunities || [],
      syllabus: course.syllabus?.length ? course.syllabus : [{ title: "", topics: [""] }]
    });
    setFormErrors({});
    setExpandedSyllabus({});
    setSkillInput("");
    setCareerInput("");
    setIsModalOpen(true);
  };

  // Open View Modal
  const openViewModal = (course) => {
    setModalMode("view");
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    setForm(defaultForm);
    setFormErrors({});
    setDeleteConfirm(null);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.thumbnail.trim()) errors.thumbnail = "Thumbnail URL is required";
    if (!form.shortDescription.trim()) errors.shortDescription = "Short description is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.price || form.price <= 0) errors.price = "Valid price is required";
    if (!form.duration.value || form.duration.value <= 0) errors.duration = "Duration value is required";
    if (!form.maxStudents || form.maxStudents <= 0) errors.maxStudents = "Max students is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      thumbnail: form.thumbnail.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      maxStudents: Number(form.maxStudents),
      projectsIncluded: Number(form.projectsIncluded),
      duration: {
        value: Number(form.duration.value),
        unit: form.duration.unit.toLowerCase()
      },
      level: form.level,
      language: form.language,
      mode: form.mode,
      certificateProvided: form.certificateProvided,
      skillsYouLearn: form.skillsYouLearn.filter(s => s && s.trim()),
      careerOpportunities: form.careerOpportunities.filter(c => c && c.trim()),
      syllabus: form.syllabus
        .filter(m => m.title?.trim())
        .map(m => ({
          title: m.title.trim(),
          topics: (m.topics || []).filter(t => t && t.trim())
        }))
    };

    try {
      if (modalMode === "edit") {
        await updateCourse(selectedCourse._id, payload);
        toast.success("Course updated successfully!");
      } else {
        await addCourse(payload);
        toast.success("Course created successfully!");
      }
      await fetchCourses();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully!");
      await fetchCourses();
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  // Tag handlers
  const addTag = (e, field, value, setter) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed && !form[field].some(tag => tag.toLowerCase() === trimmed.toLowerCase())) {
        setForm(prev => ({ ...prev, [field]: [...prev[field], trimmed] }));
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
        i === moduleIndex ? { ...module, topics: [...module.topics, ""] } : module
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
          ? { ...module, topics: module.topics.map((topic, j) => j === topicIndex ? value : topic) }
          : module
      )
    }));
  };

  const toggleSyllabusExpand = (index) => {
    setExpandedSyllabus(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Filter courses
  const filteredCourses = courses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  // Get level badge color
  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-emerald-100 text-emerald-700',
      'Intermediate': 'bg-amber-100 text-amber-700',
      'Advanced': 'bg-rose-100 text-rose-700'
    };
    return colors[level] || 'bg-slate-100 text-slate-700';
  };

  // Get mode icon
  const getModeIcon = (mode) => {
    switch(mode) {
      case 'Online': return <Wifi size={14} />;
      case 'Offline': return <Users size={14} />;
      default: return <Globe size={14} />;
    }
  };

  // Stats
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.isActive !== false).length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Course Management
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create, manage, and organize your educational content
              </p>
            </div>
            
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              Create New Course
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Total Courses</p>
                  <p className="text-2xl font-bold text-slate-900">{totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Active Courses</p>
                  <p className="text-2xl font-bold text-emerald-600">{activeCourses}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-emerald-400" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Total Enrollments</p>
                  <p className="text-2xl font-bold text-amber-600">{totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
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

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No courses found</h3>
            <p className="text-sm text-slate-500 mt-1">Get started by creating your first course</p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail || "https://placehold.co/400x300?text=Course"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x300?text=No+Image";
                    }}
                  />
                  {course.certificateProvided && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Award size={12} />
                      Certificate
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${getLevelColor(course.level)}`}>
                      {course.level || "Beginner"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                    {course.shortDescription}
                  </p>

                  {/* Course Info */}
                  <div className="flex flex-wrap gap-3 mb-4 text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock size={14} />
                      <span>{course.duration?.value} {course.duration?.unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      {getModeIcon(course.mode)}
                      <span>{course.mode || "Offline"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Users size={14} />
                      <span>Max {course.maxStudents}</span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-indigo-600">₹{course.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openViewModal(course)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Course"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(course)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Modal (Create/Edit/View) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}></div>
          
          <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${modalMode === "view" ? 'bg-slate-50' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'} flex justify-between items-center`}>
              <div>
                <h2 className={`text-xl font-bold ${modalMode === "view" ? 'text-slate-900' : 'text-white'}`}>
                  {modalMode === "create" && "Create New Course"}
                  {modalMode === "edit" && "Edit Course"}
                  {modalMode === "view" && "Course Details"}
                </h2>
                <p className={`text-sm mt-1 ${modalMode === "view" ? 'text-slate-500' : 'text-indigo-100'}`}>
                  {modalMode === "view" ? selectedCourse?.title : "Fill in the course information below"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg transition-colors ${modalMode === "view" ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/20 text-white'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {modalMode === "view" ? (
                // View Mode - Display Course Details
                <div className="space-y-6">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                    <img
                      src={selectedCourse?.thumbnail}
                      alt={selectedCourse?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedCourse?.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{selectedCourse?.shortDescription}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-2xl font-bold text-indigo-600">₹{selectedCourse?.price?.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="text-2xl font-bold text-slate-900">{selectedCourse?.duration?.value} {selectedCourse?.duration?.unit}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500">Level</p>
                      <p className="text-lg font-semibold">{selectedCourse?.level}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-xs text-slate-500">Mode</p>
                      <p className="text-lg font-semibold">{selectedCourse?.mode}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
                    <p className="text-sm text-slate-600">{selectedCourse?.description}</p>
                  </div>

                  {/* Skills */}
                  {selectedCourse?.skillsYouLearn?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Skills You'll Learn</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.skillsYouLearn.map((skill, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus */}
                  {selectedCourse?.syllabus?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Syllabus</h4>
                      <div className="space-y-3">
                        {selectedCourse.syllabus.map((module, i) => (
                          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                              Module {i + 1}: {module.title}
                            </div>
                            <div className="p-4 space-y-2">
                              {module.topics?.map((topic, j) => (
                                <div key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                  {topic}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Create/Edit Mode - Form
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase flex items-center gap-2">
                      <Layers size={14} /> Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Course Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          placeholder="e.g., Advanced JavaScript Mastery"
                          value={form.title}
                          onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                          className={`w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 ${formErrors.title ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
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
                          className={`w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 ${formErrors.thumbnail ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="2999"
                          value={form.price}
                          onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))}
                          className={`w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 ${formErrors.price ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Max Students <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="50"
                          value={form.maxStudents}
                          onChange={(e) => setForm(p => ({ ...p, maxStudents: e.target.value }))}
                          className={`w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 ${formErrors.maxStudents ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                        />
                      </div>

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
                            className="w-24 rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                          />
                          <select
                            value={form.duration.unit}
                            onChange={(e) => setForm(p => ({ ...p, duration: { ...p.duration, unit: e.target.value } }))}
                            className="flex-1 rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                          >
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Projects Included</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="4"
                          value={form.projectsIncluded}
                          onChange={(e) => setForm(p => ({ ...p, projectsIncluded: e.target.value }))}
                          className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase flex items-center gap-2">
                      <Target size={14} /> Course Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        value={form.level}
                        onChange={(e) => setForm(p => ({ ...p, level: e.target.value }))}
                        className="rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>

                      <select
                        value={form.language}
                        onChange={(e) => setForm(p => ({ ...p, language: e.target.value }))}
                        className="rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Gujarati">Gujarati</option>
                      </select>

                      <select
                        value={form.mode}
                        onChange={(e) => setForm(p => ({ ...p, mode: e.target.value }))}
                        className="rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.certificateProvided}
                        onChange={(e) => setForm(p => ({ ...p, certificateProvided: e.target.checked }))}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <span className="text-sm font-medium text-slate-700">Certificate Provided</span>
                    </label>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase flex items-center gap-2">
                      <FileText size={14} /> Descriptions
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Short Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        placeholder="Brief overview (max 200 characters)"
                        rows={2}
                        maxLength={200}
                        value={form.shortDescription}
                        onChange={(e) => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                        className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 resize-none"
                      />
                      <p className="text-xs text-slate-400 mt-1 text-right">{form.shortDescription.length}/200</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Full Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        placeholder="Detailed course description..."
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-indigo-600 uppercase flex items-center gap-2">
                      <Zap size={14} /> Skills You'll Learn
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg min-h-[60px] border border-slate-200">
                      {form.skillsYouLearn.map((skill, i) => (
                        <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          {skill}
                          <button type="button" onClick={() => removeTag('skillsYouLearn', i)} className="hover:bg-indigo-200 rounded-full p-0.5">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      {form.skillsYouLearn.length === 0 && (
                        <span className="text-sm text-slate-400">No skills added yet</span>
                      )}
                    </div>
                    
                    <input
                      placeholder="Add skills (press Enter or comma)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => addTag(e, 'skillsYouLearn', skillInput, setSkillInput)}
                      className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Career Opportunities */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase flex items-center gap-2">
                      <Briefcase size={14} /> Career Opportunities
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg min-h-[60px] border border-slate-200">
                      {form.careerOpportunities.map((career, i) => (
                        <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          {career}
                          <button type="button" onClick={() => removeTag('careerOpportunities', i)} className="hover:bg-emerald-200 rounded-full p-0.5">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      {form.careerOpportunities.length === 0 && (
                        <span className="text-sm text-slate-400">No career paths added yet</span>
                      )}
                    </div>
                    
                    <input
                      placeholder="Add career roles (press Enter or comma)"
                      value={careerInput}
                      onChange={(e) => setCareerInput(e.target.value)}
                      onKeyDown={(e) => addTag(e, 'careerOpportunities', careerInput, setCareerInput)}
                      className="w-full rounded-lg border p-3 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Syllabus */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-purple-600 uppercase flex items-center gap-2">
                        <BookOpen size={14} /> Course Syllabus
                      </h3>
                      <button
                        type="button"
                        onClick={addModule}
                        className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium hover:bg-purple-200"
                      >
                        <Plus size={12} className="inline mr-1" /> Add Module
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.syllabus.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="border border-slate-200 rounded-xl overflow-hidden">
                          <div className="bg-slate-50 p-3 flex items-center justify-between cursor-pointer" onClick={() => toggleSyllabusExpand(moduleIndex)}>
                            <div className="flex items-center gap-3 flex-1">
                              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {moduleIndex + 1}
                              </span>
                              <input
                                placeholder="Module title"
                                value={module.title}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)}
                                className="flex-1 bg-transparent border-0 p-1 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 rounded"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              {form.syllabus.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeModule(moduleIndex); }}
                                  className="p-1 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              {expandedSyllabus[moduleIndex] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                          
                          {expandedSyllabus[moduleIndex] && (
                            <div className="p-4 space-y-3">
                              {module.topics.map((topic, topicIndex) => (
                                <div key={topicIndex} className="flex gap-2">
                                  <input
                                    placeholder={`Topic ${topicIndex + 1}`}
                                    value={topic}
                                    onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                                    className="flex-1 rounded-lg border p-2 text-sm outline-none focus:border-purple-500"
                                  />
                                  {module.topics.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTopic(moduleIndex, topicIndex)}
                                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                                    >
                                      <X size={14} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => addTopic(moduleIndex)}
                                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                              >
                                <Plus size={12} className="inline mr-1" /> Add Topic
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode !== "view" && (
              <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {modalMode === "edit" ? "Update Course" : "Create Course"}
                </button>
              </div>
            )}
            
            {modalMode === "view" && (
              <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Course</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm.title}</span>? 
              All associated data will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;