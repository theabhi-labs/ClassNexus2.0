import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Legend, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { Users, BookOpen, Award, UserCheck, ArrowUpRight, Clock, UserPlus } from "lucide-react";

const Dashboard = () => {
  const metrics = [
    { title: "Total Students", value: "1,240", icon: Users, trend: "+12%", color: "#4F46E5" },
    { title: "Total Courses", value: "24", icon: BookOpen, trend: "+2", color: "#10B981" },
    { title: "Certificates", value: "850", icon: Award, trend: "+45", color: "#F59E0B" },
    { title: "Active Faculty", value: "12", icon: UserCheck, trend: "Stable", color: "#6366F1" },
  ];

  const studentGrowth = [
    { month: "Jan", students: 400 }, { month: "Feb", students: 600 },
    { month: "Mar", students: 500 }, { month: "Apr", students: 900 },
    { month: "May", students: 1100 }, { month: "Jun", students: 1240 },
  ];

  const courseEnrollments = [
    { name: "Web Dev", qty: 450 }, { name: "Python", qty: 380 },
    { name: "AI/ML", qty: 320 }, { name: "Java", qty: 210 },
  ];

  return (
    <div className="space-y-10 pb-10">
      
      {/* ─── Premium Metrics Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                <m.icon size={22} />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${m.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {m.trend}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{m.title}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{m.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Area Chart: Student Growth */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Student Trajectory</h2>
            <button className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 hover:underline">
              Download Report <ArrowUpRight size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentGrowth}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Area type="monotone" dataKey="students" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Enrollment by Category */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 tracking-tight mb-8">Course Popularity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseEnrollments}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
              <Bar dataKey="qty" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Lists Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Enrollments</h2>
            <UserPlus size={20} className="text-slate-400" />
          </div>
          <div className="p-2">
            {[
              { name: "Abhishek Yadav", course: "Web Development", date: "Today" },
              { name: "Riya Sharma", course: "Advanced Python", date: "Yesterday" },
              { name: "Vikram Singh", course: "AI/ML Masterclass", date: "20 Jan" },
            ].map((en, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#4F46E5] font-bold text-xs">
                    {en.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{en.name}</p>
                    <p className="text-xs text-slate-500">{en.course}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{en.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Live Activity</h2>
            <Clock size={20} className="text-slate-400" />
          </div>
          <div className="p-6 space-y-6">
            {[
              { msg: "Certificate issued to Abhishek Yadav", time: "2h ago", type: "success" },
              { msg: "New course 'React JS' added", time: "5h ago", type: "info" },
              { msg: "Faculty profile updated: Vikram Singh", time: "2d ago", type: "info" },
            ].map((act, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 2 && <div className="absolute left-[11px] top-8 w-px h-10 bg-slate-100" />}
                <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0 ${act.type === 'success' ? 'bg-emerald-500' : 'bg-[#4F46E5]'}`} />
                <div className="pb-2">
                  <p className="text-sm font-medium text-slate-700 leading-tight">{act.msg}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;