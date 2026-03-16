import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Star, Save, Trash2, Plus } from "lucide-react";

export default function StatsSettings() {
  const [stats, setStats] = useState([
    { number: "10+", title: "Years Experience", desc: "Trusted since 2015", icon: Star, color: "text-amber-500" },
    { number: "50+", title: "Expert Faculty", desc: "IIT & NIT alumni", icon: Users, color: "text-indigo-500" },
    { number: "1000+", title: "Study Notes", desc: "High-quality & conceptual", icon: BookOpen, color: "text-emerald-500" },
    { number: "95%", title: "Success Rate", desc: "Consistent top results", icon: TrendingUp, color: "text-rose-500" },
  ]);

  const handleChange = (index, field, value) => {
    const updatedStats = [...stats];
    updatedStats[index][field] = value;
    setStats(updatedStats);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Growth Metrics</h2>
          <p className="text-slate-500 font-medium italic">Showcase your institute's success milestones.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
                <Plus size={18} /> Add Stat
            </button>
            <button 
                onClick={() => alert("Stats Synchronized!")}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 transition-all"
            >
                <Save size={18} /> Save All
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
          >
            {/* Delete Button (Hidden by default) */}
            <button className="absolute -top-3 -right-3 p-2 bg-rose-50 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-rose-100">
                <Trash2 size={14} />
            </button>

            <div className="flex items-start gap-6">
                {/* Icon Circle */}
                <div className={`mt-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                    <stat.icon size={24} />
                </div>

                {/* Input Fields Container */}
                <div className="flex-1 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Big Number</label>
                            <input
                                type="text"
                                value={stat.number}
                                onChange={(e) => handleChange(index, "number", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-lg font-black text-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Label/Title</label>
                            <input
                                type="text"
                                value={stat.title}
                                onChange={(e) => handleChange(index, "title", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subtext Description</label>
                        <input
                            type="text"
                            value={stat.desc}
                            onChange={(e) => handleChange(index, "desc", e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-500"
                        />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="mt-12 p-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-[24px] border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-4">
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
            <BarChart3 className="text-indigo-600" size={20} />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Social Proof Optimization</p>
            <p className="text-[11px] text-slate-500 font-medium">Using "+" or "%" in your numbers increases trust by 40% based on student psychological studies.</p>
        </div>
      </div>
    </div>
  );
}