import React, { useState } from 'react';
import { Upload, CheckCircle2, Palette, Globe, Image as ImageIcon, Save } from "lucide-react";

export default function BrandSettings() {
  const [brand, setBrand] = useState({
    instituteName: "EduAdmin Academy",
    tagline: "Empowering the next generation of creators",
    primaryColor: "#4f46e5",
    logo: null,
    favicon: null,
  });

  const [previews, setPreviews] = useState({ logo: null, favicon: null });

  const handleChange = (field, value) => {
    setBrand(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setBrand(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Brand Identity</h2>
        <p className="text-slate-500 font-medium">Define your institute's visual presence across the platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Configuration Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Visual Identity Section */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Core Details</h3>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block ml-1">Institute Name</label>
                <input
                  type="text"
                  value={brand.instituteName}
                  onChange={(e) => handleChange("instituteName", e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block ml-1">Tagline</label>
                <textarea
                  rows={2}
                  value={brand.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Theme & Assets Section */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-rose-600">
                <Palette size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Visual Assets</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Picker */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 block">Theme Color</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={brand.primaryColor}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="w-14 h-14 rounded-xl border-none cursor-pointer bg-transparent"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{brand.primaryColor.toUpperCase()}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Primary UI Accent</p>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="relative group">
                 <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block ml-1">Institute Logo</label>
                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:border-indigo-300 transition-all">
                    <Upload size={20} className="text-slate-400 mb-2" />
                    <span className="text-[11px] font-bold text-slate-500">JPG, PNG (Max 2MB)</span>
                    <input type="file" hidden onChange={(e) => handleFileChange("logo", e.target.files[0])} />
                 </label>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Live Preview (The "UX Magic") */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Live Preview</label>
            
            {/* Card Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 shadow-xl overflow-hidden shadow-indigo-100 dark:shadow-none">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 flex items-end px-6 pb-4" style={{ backgroundColor: `${brand.primaryColor}20` }}>
                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                  {previews.logo ? <img src={previews.logo} alt="Logo" className="object-contain" /> : <ImageIcon className="text-slate-300" />}
                </div>
              </div>
              <div className="p-8 pt-6">
                <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">{brand.instituteName}</h4>
                <p className="text-sm text-slate-500 font-medium mb-6">{brand.tagline}</p>
                
                <div className="space-y-3">
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                   <div className="h-2 w-2/3 bg-slate-100 dark:bg-slate-800 rounded-full" />
                </div>

                <button 
                  className="w-full mt-8 py-3 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: brand.primaryColor, shadowColor: brand.primaryColor }}
                >
                  Action Button
                </button>
              </div>
            </div>

            {/* Save Action */}
            <button
              onClick={() => alert("Settings Synced!")}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-black hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <Save size={20} />
              SAVE BRAND IDENTITY
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}