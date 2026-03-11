import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IndianRupee, Download, BookOpen, CreditCard,
  Award, LogOut, History, CheckCircle2,
  Calendar, Phone, Mail, LayoutDashboard,
  Clock, ShieldCheck, ArrowUpRight, Wallet
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
      let effectiveId = (id && id !== "undefined") ? id : null;
      if (!effectiveId) {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        effectiveId = storedUser._id;
      }

      console.log("Fetching for ID:", effectiveId);

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
          setError(res.data?.message || "Could not load profile data.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Network error: Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Loading overlay dikhao
    try {
      // 1. Backend API Call (Cookies clear karne ke liye)
      await logoutUser();
    } catch (err) {
      console.error("Backend logout failed, forcing local logout", err);
    } finally {
      // 2. Clear Local Storage (Hamesha execute hoga)
      localStorage.clear();

      // 3. Redirect after a small delay for UX
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return <StudentProfileContent data={data} />;
};

const StudentProfileContent = ({ data }) => {
  const { profile, student, enrollments = [] } = data;
  const studentDisplayId = enrollments[0]?.enrollmentNo || "N/A";

  const totalFee = enrollments.reduce((acc, e) => acc + (e.payment?.totalFee || 0), 0);
  const paidAmount = enrollments.reduce((acc, e) => acc + (e.payment?.paidAmount || 0), 0);
  const remaining = totalFee - paidAmount;

  return (

    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100 pb-20">

      {/* --- PREMIUM FLOATING NAVBAR --- */}
      <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-100/50 rounded-[2.5rem] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2 rounded-2xl shadow-lg shadow-indigo-200">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tighter italic">TECHVISION</span>
          </div>

          <div className="flex items-center gap-6">
            // Isse use karo navbar mein
            <button
              onClick={handleLogout} // <--- handleLogout call karo
              disabled={isLoggingOut}
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-all"
            >
              <span className="hidden sm:block">
                {isLoggingOut ? "SIGNING OUT..." : "SIGN OUT"}
              </span>
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">

        {/* --- HERO SECTION --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-12">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Student Portal</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Student ID: <span className="font-bold text-slate-800">{studentDisplayId}</span></p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <div className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><CheckCircle2 size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Courses</p>
                <p className="text-xl font-black">{enrollments.length}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Wallet size={24} /></div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Certificates</p>
                <p className="text-xl font-black">{enrollments.filter(e => e.certificate?.issued).length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: CONTACT & FINANCE */}
          <div className="lg:col-span-4 space-y-8">
            {/* PROFILE CARD */}
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 transition-transform hover:scale-110"></div>
              <div className="relative z-10">
                <img
                  src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${profile.name}&background=6366f1&color=fff`}
                  className="w-20 h-20 rounded-3xl object-cover mb-6 shadow-xl border-4 border-white"
                  alt="profile"
                />
                <div className="space-y-4">
                  <ContactLine icon={<Mail />} value={profile.email} />
                  <ContactLine icon={<Phone />} value={student.mobile} />
                  <ContactLine icon={<Calendar />} value={new Date(student.dob).toLocaleDateString()} />
                </div>
              </div>
            </div>

            {/* FINANCE CARD */}
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-100 relative overflow-hidden group border border-white/5">
              {/* Background Decorative Icon */}
              <div className="absolute -bottom-6 -right-6 p-4 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                <IndianRupee size={160} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em]">
                    Billing Overview
                  </p>
                  <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                    <CreditCard size={18} className="text-indigo-300" />
                  </div>
                </div>

                <div className="space-y-8">
                  {/* 1. TOTAL COURSE VALUE */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Total Course Fee
                    </p>
                    <p className="text-4xl font-black tracking-tighter italic flex items-baseline gap-1">
                      <span className="text-xl font-medium not-italic text-slate-500">₹</span>
                      {totalFee.toLocaleString()}
                    </p>
                  </div>

                  {/* 2. PROGRESS BAR (Optional but looks pro) */}
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-1000"
                      style={{ width: `${(paidAmount / totalFee) * 100}%` }}
                    />
                  </div>

                  {/* 3. BREAKDOWN GRID */}
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                        Paid to Date
                      </p>
                      <p className="text-xl font-bold text-white flex items-center gap-1 leading-none">
                        <span className="text-sm font-normal text-slate-500">₹</span>
                        {paidAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">
                        Balance Due
                      </p>
                      <p className="text-xl font-bold text-white flex items-center justify-end gap-1 leading-none">
                        <span className="text-sm font-normal text-slate-500">₹</span>
                        {remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Status Badge */}
                <div className="mt-8 pt-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${remaining === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${remaining === 0 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {remaining === 0 ? 'Full Payment Settled' : 'Installments Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: COURSES & PAYMENTS */}
          <div className="lg:col-span-8 space-y-8">
            {/* COURSES SECTION */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-600" /> Active Learning
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((e, idx) => (
                  <CourseCard key={idx} enrollment={e} />
                ))}
              </div>
            </div>

            {/* PAYMENT LOGS */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <History size={18} className="text-indigo-600" /> Payment History
                </h3>
                <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">RECENT LOGS</span>
              </div>
              <div className="px-4 pb-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4 text-right">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {enrollments.flatMap(enr => enr.payment.history).map((p, i) => (
                      <tr key={i} className="group hover:bg-slate-50 transition-all">
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-slate-700">{new Date(p.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-black text-indigo-600">₹{p.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">{p.method}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* --- CERTIFICATES SECTION (BOTTOM WIDE) --- */}
        <section className="mt-12">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">Earned Recognition</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrollments.filter(e => e.certificate?.issued).length > 0 ? (
              enrollments.filter(e => e.certificate?.issued).map((e, i) => (
                <CertificateCard key={i} e={e} />
              ))
            ) : (
              <div className="col-span-full py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center">
                <Award size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400 font-bold text-sm italic">Unlock certificates by completing courses</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ContactLine = ({ icon, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="text-indigo-500 bg-indigo-50 p-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <span className="text-sm font-bold text-slate-600 truncate">{value}</span>
  </div>
);

const CourseCard = ({ enrollment }) => (
  <div className="group bg-slate-50 hover:bg-white p-6 rounded-3xl border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${enrollment.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
        {enrollment.status}
      </div>
      <ArrowUpRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
    </div>
    <h4 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{enrollment.course.title}</h4>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">ID: {enrollment.enrollmentNo}</p>
    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
      <Calendar size={14} /> {new Date(enrollment.joined).toLocaleDateString()}
    </div>
  </div>
);

const CertificateCard = ({ e }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-600 transition-all">
    <div className="flex items-center gap-4">
      <div className="bg-amber-50 p-3 rounded-2xl text-amber-600 group-hover:rotate-12 transition-transform">
        <Award size={24} />
      </div>
      <div>
        <h5 className="font-bold text-sm text-slate-800">{e.course.title}</h5>
        <p className="text-[10px] text-slate-400 font-bold uppercase">Issued 2024</p>
      </div>
    </div>
    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
      <Download size={18} />
    </button>
  </div>
);

const LoadingSkeleton = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-indigo-900 font-black text-xs tracking-[0.3em] uppercase animate-pulse">Initializing Portal</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50 px-6">
    <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-sm border border-red-50">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Login Required</h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">{message}</p>
      <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
        GO TO LOGIN
      </button>
    </div>
  </div>
);

export default StudentProfile;