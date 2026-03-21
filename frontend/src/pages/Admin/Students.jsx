import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  X,
  Loader2,
  GraduationCap,
  ShieldCheck,
  Link as LinkIcon,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
  Award,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { enrollStudent, updateStudent, adminDashboardStudents, getStudentDetails, deleteStudent } from "../../api/student.api.js";
import { getCourses } from "../../api/courses.api";
import { certificateIssue, getCertificate } from "../../api/certificate.api";
import StudentDocuments from "./Students/StudentDocuments";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [issuing, setIssuing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState("INACTIVE");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          adminDashboardStudents(),
          getCourses()
        ]);
        setStudents(studentsRes?.data?.data || []);
        setCourses(coursesRes?.data?.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to load student data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = students.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(searchLower)) ||
      (s.email && s.email.toLowerCase().includes(searchLower)) ||
      (s.enrollmentNo && s.enrollmentNo.toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ FIXED: Certificate Issue Handler
  const handleIssueCertificate = async (enrollmentId) => {
    if (!enrollmentId) {
      toast.error("No enrollment ID found");
      return;
    }

    try {
      setIssuing(true);

      const res = await certificateIssue(enrollmentId);

      // ✅ Check for response data structure
      if (res?.data?.data) {
        // Store the certificate data
        setCertificate(res.data.data);
        toast.success(res?.data?.message || "Certificate Issued Successfully!");

        // Refresh student data to get updated enrollment
        await refreshStudents();

        // Also update the current modal's certificate state
        if (selected && selected.studentId) {
          const updatedRes = await getStudentDetails(selected.studentId);
          const updatedData = updatedRes.data.data;
          const updatedEnrollment = updatedData.enrollments?.[0];
          if (updatedEnrollment?.certificate) {
            setCertificate(updatedEnrollment.certificate);
          }
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Certificate Issue Error:", error);
      toast.error(error?.response?.data?.message || "Certificate Issue Failed");
    } finally {
      setIssuing(false);
    }
  };

  // ✅ FIXED: Download Certificate Handler
  const handleDownloadCertificate = async (certificateId) => {
    if (!certificateId) {
      toast.error("No certificate ID found");
      return;
    }

    try {
      setDownloading(true);
      const res = await getCertificate(certificateId);

      if (res?.data) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificate_${certificateId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Certificate downloaded successfully!");
      } else {
        throw new Error("No PDF data received");
      }
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Download Failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!formData?.studentId) {
      toast.error("No student selected for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteStudent(formData.studentId);
      toast.success("Student deleted successfully!");
      setSelected(null);
      setShowDeleteConfirm(false);
      await refreshStudents();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete student");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData?.userId) return toast.error("No student selected");
    if (!formData.course) return toast.error("Please select a course");
    if (!formData.mobile || formData.mobile.length !== 10)
      return toast.error("Mobile must be 10 digits");
    if (!formData.dob) return toast.error("Date of Birth is required");

    setIsSubmitting(true);

    const payload = {
      userId: formData.userId,
      mobileNum: formData.mobile,
      dob: formData.dob,
      courseId: formData.course,
      status: enrollmentStatus
    };

    try {
      if (formData.studentId) {
        await updateStudent(formData.studentId, payload);
        toast.success("Student updated successfully!");
      } else {
        await enrollStudent(payload);
        toast.success("Student enrolled successfully!");
      }

      await refreshStudents();
      setSelected(null);
    } catch (err) {
      console.error("Save Error:", err.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to save student details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const refreshStudents = async () => {
    try {
      const res = await adminDashboardStudents();
      setStudents(res.data.data);
    } catch (error) {
      console.error("Refresh Error:", error);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DROPPED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <ShieldCheck className="h-3 w-3" />;
      case 'COMPLETED':
        return <Award className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Student Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage enrollments, update details, and monitor student progress
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search by name, email or enrollment ID..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-44 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="COMPLETED">Completed</option>
              <option value="DROPPED">Dropped</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{students.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Students</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {students.filter(s => s.status === 'ACTIVE').length}
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.filter(s => s.status === 'COMPLETED').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Filtered Results</p>
                <p className="text-2xl font-bold text-slate-900">{filtered.length}</p>
              </div>
              <Search className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
              Student Directory
              <span className="ml-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                {filtered.length}
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Student</th>
                  <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Course & ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500 mb-4" />
                      <p className="text-sm text-slate-500">Loading student records...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                        <User className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-base font-medium text-slate-900">No students found</p>
                      <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((student) => (
                    <tr key={student.studentId || student.userId} className="transition-colors hover:bg-slate-50 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-sm font-bold text-indigo-700">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{student.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3" /> {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <div className="text-sm text-slate-700 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {student.mobile || "Not provided"}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {student.dob ? new Date(student.dob).toLocaleDateString() : "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          {student.course || "Not Assigned"}
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-1">
                          ID: {student.enrollmentNo || "Pending"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeStyle(student.status)}`}>
                          {getStatusIcon(student.status)}
                          {student.status || "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            setSelected(student);
                            setCertificate(null);

                            if (student.studentId) {
                              try {
                                const res = await getStudentDetails(student.studentId);
                                const data = res.data.data;
                                const studentData = data.student;
                                const enrollment = data.enrollments?.[0];

                                setFormData({
                                  userId: studentData.user._id,
                                  studentId: studentData._id,
                                  name: studentData.user.name,
                                  email: studentData.user.email,
                                  mobile: studentData.mobileNum || "",
                                  dob: studentData.dob?.split("T")[0] || "",
                                  course: enrollment?.course?._id || "",
                                  enrollmentId: enrollment?._id || "",
                                  enrollmentNo: enrollment?.enrollmentNo || "",
                                  aadhar: studentData.documents?.aadhar || null,
                                  marksheet10: studentData.documents?.marksheet10 || null,
                                  marksheet12: studentData.documents?.marksheet12 || null
                                });

                                setEnrollmentStatus(enrollment?.status || "INACTIVE");

                                // ✅ Check if certificate exists in enrollment
                                if (enrollment?.certificate) {
                                  setCertificate(enrollment.certificate);
                                }
                              } catch (err) {
                                console.error(err);
                                toast.error("Failed to load student details");
                              }
                            } else {
                              setFormData({
                                userId: student.userId,
                                studentId: null,
                                name: student.name || "",
                                email: student.email || "",
                                mobile: "",
                                dob: "",
                                course: "",
                                enrollmentId: "",
                                enrollmentNo: "",
                                aadhar: null,
                                marksheet10: null,
                                marksheet12: null
                              });
                              setEnrollmentStatus("INACTIVE");
                              // View Profile button ke andar, setFormData ke baad yeh add karo:
                              console.log("=== Enrollment Details ===");
                              console.log("Enrollment ID:", enrollment?._id);
                              console.log("Enrollment Status:", enrollment?.status);
                              console.log("Certificate exists:", enrollment?.certificate);
                              console.log("Full enrollment object:", enrollment);
                            }
                          }}
                          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Profile Review */}
      {selected && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)}></div>

          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Student Profile</h2>
                <p className="text-sm text-slate-500 mt-0.5">Review and update student information</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">

              {/* Basic Info */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-500" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                    <input type="text" value={formData.name} disabled className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                    <input type="email" value={formData.email} disabled className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile Number *</label>
                    <input type="tel" name="mobile" placeholder="10 Digit Mobile" value={formData.mobile || ""} onChange={handleChange} maxLength="10" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date of Birth *</label>
                    <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  Academic Enrollment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Course *</label>
                    <select
                      name="course"
                      value={formData.course || ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
                    >
                      <option value="" disabled>Select a course program...</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Enrollment Status</label>
                    <select
                      value={enrollmentStatus}
                      onChange={(e) => setEnrollmentStatus(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"
                    >
                      <option value="INACTIVE">Inactive</option>
                      <option value="ACTIVE">Active</option>
                      <option value="DROPPED">Dropped</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {formData?.studentId ? (
                <StudentDocuments
                  studentId={formData.studentId}
                  documents={{
                    aadhar: formData.aadhar,
                    marksheet10: formData.marksheet10,
                    marksheet12: formData.marksheet12
                  }}
                />
              ) : (
                <div className="p-4 border rounded-xl bg-slate-50 text-slate-500 text-center">
                  <AlertCircle className="h-5 w-5 mx-auto mb-2 text-slate-400" />
                  Student must be created before uploading documents.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center border-t border-slate-200 px-6 py-4 bg-slate-50">
  <div className="flex gap-3">
    {/* Delete Button */}
    {formData?.studentId && (
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
      >
        <Trash2 className="h-4 w-4" />
        Delete Student
      </button>
    )}

    {/* ✅ Certificate Section - Fixed */}
    {formData?.enrollmentId && enrollmentStatus === "COMPLETED" && !certificate && (
      <button
        onClick={() => handleIssueCertificate(formData.enrollmentId)}
        disabled={issuing}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm"
      >
        {issuing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Issuing...
          </>
        ) : (
          <>
            <Award className="h-4 w-4" />
            Issue Certificate
          </>
        )}
      </button>
    )}

    {/* ✅ Download Button - Shows when certificate exists */}
    {certificate && certificate.certificateId && (
      <button
        onClick={() => handleDownloadCertificate(certificate.certificateId)}
        disabled={downloading}
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm"
      >
        {downloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download Certificate
          </>
        )}
      </button>
    )}
  </div>

  {/* Save Button */}
  <button
    onClick={handleSave}
    disabled={isSubmitting}
    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center gap-2 disabled:opacity-60 shadow-sm"
  >
    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
    {formData?.studentId ? "Update Changes" : "Enroll Student"}
  </button>
</div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Student</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{formData?.name}</span>?
              All associated data including enrollments and documents will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}