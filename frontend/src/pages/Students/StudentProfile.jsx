import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IndianRupee, Download, BookOpen, CreditCard,
  Award, LogOut, History, CheckCircle2,
  Calendar, Phone, Mail, ShieldCheck, ArrowUpRight, Wallet, ExternalLink
} from "lucide-react";
import { getUserProfile } from "../../api/student.api.js";
import { logoutUser } from "../../api/auth.api.js";

const StudentProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      let effectiveId = (id && id !== "undefined" && id.length > 5) ? id : null;
      if (!effectiveId) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        effectiveId = storedUser._id || storedUser.id;
      }

      if (!effectiveId) {
        setLoading(false);
        setError("Session expired. Please login again.");
        return;
      }

      try {
        const res = await getUserProfile(effectiveId);
        if (res.data?.success) {
          setData(res.data.data);
        } else {
          setError(res.data?.message || "Student info not found.");
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Profile not found in database.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localStorage.clear();
      setTimeout(() => { window.location.href = "/"; }, 1000);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return <StudentProfileContent data={data} onLogout={handleLogout} isLoggingOut={isLoggingOut} />;
};

const StudentProfileContent = ({ data, onLogout, isLoggingOut }) => {
  const profile = data?.profile || {};
  const student = data?.student || {};
  const enrollments = data?.enrollments || [];

  const firstName = profile?.name ? profile.name.split(' ')[0] : "Student";
  const studentDisplayId = enrollments[0]?.enrollmentNo || "N/A";

  const totalFee = enrollments.reduce((acc, e) => acc + (e.payment?.totalFee || 0), 0);
  const paidAmount = enrollments.reduce((acc, e) => acc + (e.payment?.paidAmount || 0), 0);
  const remaining = totalFee - paidAmount;

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100 pb-20">
      {/* Navbar Section */}
      <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-2xl shadow-lg shadow-indigo-200">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tighter italic uppercase">Techvision</span>
          </div>
          <button onClick={onLogout} disabled={isLoggingOut} className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-all">
            <span className="hidden sm:block">{isLoggingOut ? "SIGNING OUT..." : "SIGN OUT"}</span>
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Header Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-12">
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{firstName}</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Student ID: <span className="font-bold text-slate-800">{studentDisplayId}</span></p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <StatCard icon={<CheckCircle2 />} label="Courses" value={enrollments.length} color="emerald" />
            <StatCard icon={<Award />} label="Certificates" value={enrollments.filter(e => e.certificate?.issued).length} color="indigo" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <img
                src={profile?.profilePhoto || `https://ui-avatars.com/api/?name=${profile?.name}&background=6366f1&color=fff`}
                className="w-20 h-20 rounded-3xl object-cover mb-6 shadow-xl border-4 border-white"
                alt="profile"
              />
              <div className="space-y-4">
                <ContactLine icon={<Mail />} value={profile?.email} />
                <ContactLine icon={<Phone />} value={student?.mobile} />
                <ContactLine icon={<Calendar />} value={student?.dob ? new Date(student.dob).toLocaleDateString() : "N/A"} />
              </div>
            </div>

            {/* Billing Card */}
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Billing Overview</p>
                <div className="space-y-6">
                  <p className="text-4xl font-black italic">₹{totalFee.toLocaleString()}</p>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                    <FinanceItem label="Paid" value={paidAmount} color="text-emerald-400" />
                    <FinanceItem label="Balance" value={remaining} color="text-red-400" align="right" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Learning Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-8">
                <BookOpen size={18} className="text-indigo-600" /> Active Learning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((e, idx) => <CourseCard key={idx} enrollment={e} />)}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Award size={18} className="text-violet-600" /> Earned Certificates
              </h3>
              <div className="space-y-4">
                {enrollments.filter(e => e.certificate?.issued).length > 0 ? (
                  enrollments.filter(e => e.certificate?.issued).map((e, idx) => (
                    <CertificateRow key={idx} cert={e.certificate} courseTitle={e.course?.title} />
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">No certificates issued yet.</p>
                )}
              </div>
            </div>

            {/* Payment Logs Section */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <History size={18} className="text-emerald-600" /> Transaction History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      <th className="pb-2 px-4">Date</th>
                      <th className="pb-2 px-4">Method</th>
                      <th className="pb-2 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.flatMap(e => e.payment?.history || []).map((log, i) => (
                      <tr key={i} className="bg-slate-50 hover:bg-slate-100 transition-colors">
                        <td className="py-4 px-4 rounded-l-2xl text-sm font-bold text-slate-600">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-xs font-black">
                          <span className="bg-white px-3 py-1 rounded-full border border-slate-200">{log.method}</span>
                        </td>
                        <td className="py-4 px-4 rounded-r-2xl text-right font-black text-emerald-600">
                          ₹{log.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

// --- NEW COMPONENTS ---

const CertificateRow = ({ cert, courseTitle }) => (
  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-violet-50 to-transparent border border-violet-100 rounded-3xl group hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="bg-white p-3 rounded-2xl shadow-sm text-violet-600">
        <Award size={24} />
      </div>
      <div>
        <h4 className="font-black text-slate-800 text-sm leading-tight">{courseTitle}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {cert.certificateId}</p>
      </div>
    </div>
    <a 
      href={cert.downloadUrl} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-black text-violet-600 border border-violet-100 hover:bg-violet-600 hover:text-white transition-all shadow-sm"
    >
      <Download size={14} /> DOWNLOAD
    </a>
  </div>
);

// --- EXISTING HELPERS (Keep as is) ---
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
    <div className={`p-3 bg-${color}-50 rounded-2xl text-${color}-600`}>{icon}</div>
    <div><p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p><p className="text-xl font-black">{value}</p></div>
  </div>
);
const FinanceItem = ({ label, value, color, align = "left" }) => (
  <div className={align === "right" ? "text-right" : ""}>
    <p className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</p>
    <p className="text-xl font-bold text-white leading-none">₹{value.toLocaleString()}</p>
  </div>
);
const ContactLine = ({ icon, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="text-indigo-500 bg-indigo-50 p-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">{React.cloneElement(icon, { size: 16 })}</div>
    <span className="text-sm font-bold text-slate-600 truncate">{value || "N/A"}</span>
  </div>
);
const CourseCard = ({ enrollment }) => (
  <div className="group bg-slate-50 hover:bg-white p-6 rounded-3xl border border-transparent hover:border-slate-100 transition-all shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${enrollment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{enrollment.status}</div>
      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
    </div>
    <h4 className="font-bold text-slate-800 text-lg mb-1">{enrollment.course?.title}</h4>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">ID: {enrollment.enrollmentNo}</p>
  </div>
);
const LoadingSkeleton = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
);
const ErrorState = ({ message }) => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50 px-6">
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Notice</h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">{message}</p>
      <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Go to Login</button>
    </div>
  </div>
);

export default StudentProfile;