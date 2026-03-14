import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IndianRupee, Download, BookOpen, CreditCard,
  Award, LogOut, History, CheckCircle2,
  Calendar, Phone, Mail, ShieldCheck, ArrowUpRight, Wallet, User, ChevronRight
} from "lucide-react";
import { getUserProfile } from "../../api/student.api.js";
import { logoutUser } from "../../api/auth.api.js";
import CertificateRow from "./CertificateRow.jsx";
import PaymentLogsTable from "./PaymentLogsTable.jsx";

const StudentProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      let effectiveId = (id && id !== "undefined") ? id : null;
      if (!effectiveId) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        effectiveId = storedUser._id || storedUser.id;
      }

      if (!effectiveId) {
        const timeout = setTimeout(() => {
          setLoading(false);
          setError("Session expired. Please login again.");
        }, 1500);
        return () => clearTimeout(timeout);
      }

      try {
        setLoading(true);
        setError(null);
        const res = await getUserProfile(effectiveId);
        if (res.data?.success) {
          setData(res.data.data);
        } else {
          setError(res.data?.message || "Student info not found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Profile not found.");
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-100 pb-20">
      <nav className="sticky top-0 z-50 w-full px-3 py-4">
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-slate-200/50 rounded-[1.8rem] px-4 sm:px-6 py-3 flex justify-between items-center">

          <div
            className="`flex-shrink-0` cursor-pointer group flex items-center gap-2 sm:gap-4"
            onClick={() => navigate("/")}
          >
            <div className="relative flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 group">
              <div className="absolute inset-0 bg-purple-600/20 blur-[20px] rounded-full animate-pulse group-hover:bg-purple-500/40 transition-all duration-700" />
              <div className="absolute inset-1 sm:inset-2 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500" />

              <svg
                viewBox="0 0 100 100"
                className="relative w-10 h-10 sm:w-16 sm:h-16 drop-shadow-2xl transform transition-all duration-500 group-hover:rotate-[-5deg]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M10 40L50 20L90 40L50 60L10 40Z" className="fill-slate-900 group-hover:fill-indigo-950 transition-colors" />
                  <path d="M25 48V62C25 62 35 70 50 70C65 70 75 62 75 62V48" className="fill-slate-800" />
                  <path d="M90 40V65" className="stroke-amber-400" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="90" cy="68" r="4" className="fill-amber-500 animate-bounce group-hover:animate-none" />
                </g>
              </svg>
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <h1 className="text-[14px] xs:text-[16px] md:text-2xl font-black tracking-tighter leading-[1.1] text-slate-800 uppercase">
                JAS COMPUTER <span className="text-indigo-600 block sm:inline">INSTITUTE</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-[1.5px] w-2 sm:w-4 bg-indigo-500 rounded-full"></span>
                <p className="text-[7px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-slate-400 whitespace-nowrap">
                  & Training Center
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="group flex items-center gap-2 sm:gap-3 pl-3 border-l border-slate-100 ml-1"
            >

              <span className="hidden sm:block text-[10px] font-black text-slate-400 group-hover:text-rose-500 transition-colors uppercase tracking-widest">
                {isLoggingOut ? "Processing" : "Sign Out"}
              </span>

              <div className="bg-slate-50 group-hover:bg-rose-50 p-2 sm:p-2.5 rounded-xl text-slate-400 group-hover:text-rose-500 transition-all duration-300 border border-transparent group-hover:border-rose-100">
                <LogOut size={16} className="`sm:w-[18px] sm:h-[18px]` group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-6">
       <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-2">
  <div>
    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
      Hello, 
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
        {firstName}
      </span>
    </h1>

    <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-tighter">
      Student Dashboard <span className="mx-2 text-slate-300">|</span> ID: {studentDisplayId}
    </p>
  </div>

  <div className="flex gap-3">
    <QuickStat icon={<BookOpen size={18} />} label="Enrolled" value={enrollments.length} color="indigo" />
    <QuickStat icon={<Award size={18} />} label="Certificates" value={enrollments.filter(e => e.certificate?.issued).length} color="amber" />
  </div>
</section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8 rounded-[2.5rem]">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                  <img
                    src={profile?.profilePhoto || `https://ui-avatars.com/api/?name=${profile?.name}&background=6366f1&color=fff`}
                    className="w-24 h-24 `rounded-[2rem]` object-cover shadow-2xl border-4 border-white"
                    alt="profile"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white"></div>
                </div>
                <h2 className="font-black text-slate-900 text-xl">{profile?.name}</h2>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2 bg-indigo-50 px-3 py-1 rounded-full">Scholar</p>
              </div>

              <div className="space-y-4">
                <ContactLine icon={<Mail />} value={profile?.email} />
                <ContactLine icon={<Phone />} value={student?.mobile} />
                <ContactLine icon={<Calendar />} value={student?.dob ? new Date(student.dob).toLocaleDateString('en-GB') : "N/A"} />
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em]">Billing Overview</p>
                  <Wallet size={20} className="text-indigo-400" />
                </div>
                <div className="mb-8">
                  <p className="text-4xl font-black italic tracking-tighter">₹{totalFee.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Total Course Value</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <FinanceItem label="Paid" value={paidAmount} color="text-emerald-400" />
                  <FinanceItem label="Due" value={remaining} color="text-rose-400" align="right" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">

            <div className="bg-white border border-slate-200/60 shadow-sm rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3 mb-8">
                <div className="w-8 h-[2px] bg-indigo-600"></div> My Learning Journey
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((e, idx) => <CourseCard key={idx} enrollment={e} />)}
              </div>
            </div>

            {/* Certificates Section */}
            <div className="bg-white border border-slate-200/60 shadow-sm rounded-[2.5rem] p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3 mb-6">
                <div className="`w-8 h-[2px]` bg-amber-500"></div> Achievements
              </h3>
              <div className="space-y-4">
                {enrollments.filter(e => e.certificate?.issued).length > 0 ? (
                  enrollments.filter(e => e.certificate?.issued).map((e, idx) => (
                    <CertificateRow key={idx} cert={e.certificate} courseTitle={e.course?.title} />
                  ))
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <p className="text-slate-400 text-sm font-bold italic">No certifications issued yet.</p>
                  </div>
                )}
              </div>
            </div>
            <PaymentLogsTable enrollments={User?.enrollments} />
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Reusable Sub-Components ---

const QuickStat = ({ icon, label, value, color }) => {
  const themes = {
    indigo: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50"
  };
  return (
    <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-slate-200/40">
      <div className={`p-2.5 rounded-xl ${themes[color]}`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-0.5">{label}</p>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  );
};

const FinanceItem = ({ label, value, color, align = "left" }) => (
  <div className={align === "right" ? "text-right" : ""}>
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-xl font-black italic ${color}`}>₹{value.toLocaleString()}</p>
  </div>
);

const ContactLine = ({ icon, value }) => (
  <div className="flex items-center gap-4 text-slate-500 group">
    <div className="text-slate-300 group-hover:text-indigo-500 transition-colors">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <span className="text-sm font-bold truncate transition-colors group-hover:text-slate-800">
      {value || "Not Provided"}
    </span>
  </div>
);

const CourseCard = ({ enrollment }) => (
  <div className="group p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500 cursor-default">
    <div className="flex justify-between items-start mb-6">
      <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${enrollment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
        }`}>
        {enrollment.status}
      </div>
      <ArrowUpRight size={18} className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
    </div>
    <h4 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{enrollment.course?.title}</h4>
    <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-tighter">Reference No: {enrollment.enrollmentNo}</p>
  </div>
);

const LoadingSkeleton = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
    <div className="w-12 h-12 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">Initializing Portal</p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-6">
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center max-w-sm">
      <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="text-rose-500" size={32} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Alert</h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">{message}</p>
      <button
        onClick={() => window.location.href = '/'}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200"
      >
        Return to Login
      </button>
    </div>
  </div>
);

export default StudentProfile;