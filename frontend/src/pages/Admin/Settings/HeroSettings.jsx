import React, { useState } from 'react';
import { 
  Type, 
  MousePointer2, 
  Image as ImageIcon, 
  Layout, 
  Save, 
  Sparkles,
  AlignLeft,
  AlignCenter
} from "lucide-react";

export default function HeroSettings() {
  const [hero, setHero] = useState({
    title: "Shape Your Future with World-Class Education",
    subtitle: "Join over 10,000+ students learning from the industry's best experts with proven results and certification.",
    primaryBtn: "Explore Courses",
    secondaryBtn: "Watch Demo",
    alignment: "left" // center | left
  });

  const handleChange = (field, value) => {
    setHero(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Hero Content <Sparkles className="text-amber-500" size={24} />
          </h2>
          <p className="text-slate-500 font-medium">This is the first thing your students see. Make it count.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-indigo-500/20 transition-all hover:-translate-y-1 active:scale-95">
          <Save size={20} />
          Update Hero Section
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Configuration Area */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Layout & Typography Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200/60 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                  <Layout size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Layout & Text</h3>
              </div>
              
              {/* Toggle Alignment */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button 
                  onClick={() => handleChange('alignment', 'left')}
                  className={`p-2 rounded-lg transition-all ${hero.alignment === 'left' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  <AlignLeft size={18} />
                </button>
                <button 
                  onClick={() => handleChange('alignment', 'center')}
                  className={`p-2 rounded-lg transition-all ${hero.alignment === 'center' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  <AlignCenter size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Main Heading (H1)</label>
                <input
                  type="text"
                  value={hero.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-4 text-base font-bold text-slate-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Sub-headline Description</label>
                <textarea
                  rows="4"
                  value={hero.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-4 text-sm font-medium leading-relaxed transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200/60 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-xl text-rose-600">
                  <MousePointer2 size={20} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Interaction Points</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Button</label>
                <input
                  type="text"
                  value={hero.primaryBtn}
                  onChange={(e) => handleChange("primaryBtn", e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-3.5 text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Secondary Button</label>
                <input
                  type="text"
                  value={hero.secondaryBtn}
                  onChange={(e) => handleChange("secondaryBtn", e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-3.5 text-sm font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Live Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-4">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2">Desktop Preview</label>
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-[40px] border-8 border-white dark:border-slate-900 shadow-2xl overflow-hidden relative group">
              
              {/* Simulated UI Content */}
              <div className={`absolute inset-0 p-8 flex flex-col justify-center ${hero.alignment === 'center' ? 'items-center text-center' : 'items-start text-left'}`}>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black tracking-widest uppercase mb-4">
                    <Sparkles size={12} /> New Batch Starting
                 </div>
                 <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                   {hero.title}
                 </h1>
                 <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed mb-6 max-w-[80%]">
                   {hero.subtitle}
                 </p>
                 <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-indigo-200">{hero.primaryBtn}</div>
                    <div className="px-5 py-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-600">{hero.secondaryBtn}</div>
                 </div>
              </div>

              {/* Decorative Mesh Gradient Background */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-3xl flex gap-3">
               <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
               <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                 Hero text should be concise. Recommended title length is 40-60 characters for maximum impact on mobile devices.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const Info = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
)