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
  Link as LinkIcon
} from "lucide-react";
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
  const [enrollmentStatus, setEnrollmentStatus] = useState("Inactive");

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

  const handleIssueCertificate = async (enrollmentId) => {
    try {
      setIssuing(true);

      const res = await certificateIssue(enrollmentId);

      setCertificate(res.data.certificate);

      alert("Certificate Issued Successfully!");
    } catch (error) {
      console.error(error);
      alert("Certificate Issue Failed");
    } finally {
      setIssuing(false);
    }
  };

  const handleDownloadCertificate = async (certificateId) => {
    try {

      setDownloading(true);

      const res = await getCertificate(certificateId);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = `${certificateId}.pdf`;
      link.click();

    } catch (error) {
      console.error(error);
      alert("Download Failed");
    } finally {
      setDownloading(false);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData?.userId) return alert("No student selected");
    if (!formData.course) return alert("Please select a course");
    if (!formData.mobile || formData.mobile.length !== 10) return alert("Mobile must be 10 digits");
    if (!formData.dob) return alert("Date of Birth is required");

    setIsSubmitting(true);

    const payload = {
  userId: formData.userId, // ✅ add this
  mobileNum: formData.mobile,
  dob: formData.dob,
  courseId: formData.course,
  status: enrollmentStatus
};

    try {
      if (formData.studentId) {
        await updateStudent(formData.studentId, payload);
        alert("Student updated successfully!");
      } else {
        await enrollStudent(payload);
        alert("Student enrolled successfully!");
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.userId === formData.userId
            ? { ...s, ...formData, status: "Active", enrollmentNo: formData.enrollmentNo || "ENROLLED" }
            : s
        )
      );
      setSelected(null);
      await refreshStudents();
    } catch (err) {
      console.error("Save Error:", err.response?.data || err);
      alert("Failed to save student details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const refreshStudents = async () => {
    const res = await adminDashboardStudents();
    setStudents(res.data.data);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Student Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage enrollments, update details, and monitor student progress.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search name, email or ID..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-slate-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
              Student Directory
              <span className="ml-2 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
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
                          <div className="flex h-10 w-10 `flex-shrink-0` items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
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
                          {student.dob || "—"}
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
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${student.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                          {student.status === 'Active' && <ShieldCheck className="h-3 w-3" />}
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            setSelected(student);
                            // Check if this user already has a student record
                            if (student.studentId) {
                              // Existing student → fetch full details
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
                              } catch (err) {
                                console.error(err);
                                alert("Failed to load student details");
                              }
                            } else {
                              // User exists but not a student yet → open empty form for enrollment
                              setFormData({
                                userId: student.userId,   // use user's ID
                                studentId: null,           // no student yet
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

                              setEnrollmentStatus("INACTIVE"); // default for new enrollment
                            }
                          }}
                          className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-indigo-600 shadow-sm border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelected(null)}></div>

          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Student Profile</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review and update student information</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">

              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                    <input type="text" value={formData.name} disabled className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                    <input type="email" value={formData.email} disabled className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mobile Number *</label>
                    <input type="text" name="mobile" placeholder="10 Digit Mobile" value={formData.mobile || ""} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date of Birth *</label>
                    <input type="date" name="dob" value={formData.dob || ""} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">Academic Enrollment</h3>
                <div className="w-full">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Course *</label>
                  <select
                    name="course"
                    value={formData.course || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-white"
                  >
                    <option value="" disabled>Select a course program...</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
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
                <div className="p-4 border rounded-lg bg-gray-50 text-gray-500">
                  Student must be created before uploading documents.
                </div>
              )}

              {/* Enrollment Status */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 border-l-4 border-indigo-500 pl-3">
                  Enrollment Status
                </h3>

                <div className="flex gap-3 items-center">

                  <select
                    value={enrollmentStatus}
                    onChange={(e) => setEnrollmentStatus(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="INACTIVE">Inactive</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DROPPED">Dropped</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                </div>
              </div>

            </div>
            <div className="flex justify-between items-center border-t border-slate-200 px-6 py-4">

              {/* LEFT SIDE CERTIFICATE BUTTON */}

              {selected?.status === "COMPLETED" && !certificate && (
                <button
                  onClick={() => handleIssueCertificate(selected.enrollmentId)}
                  disabled={issuing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {issuing ? "Issuing..." : "Issue Certificate"}
                </button>
              )}

              {certificate?.certificateId && (
                <button
                  onClick={() => handleDownloadCertificate(certificate.certificateId)}
                  disabled={downloading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-60"
                >

                  {downloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    "Download Certificate"
                  )}

                </button>
              )}

              {/* RIGHT SIDE SAVE BUTTON */}

              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}

                {formData?.studentId ? "Update" : "Save Changes"}

              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
