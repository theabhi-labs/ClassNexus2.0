import React, { useState } from 'react';
import SettingsNav from "./SettingsNav"; // Iska horizontal version niche hai
import HeroSettings from "./HeroSettings";
import BrandSettings from "./BrandSettings";
import StatsSettings from "./StatsSettings";
import FooterSettings from "./FooterSettings";
import { Save, Globe, Eye } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("hero");
  const [siteData, setSiteData] = useState({
    brand: { instituteName: "EduAdmin Academy", primaryColor: "#4f46e5" },
    hero: { title: "Shape Your Future", subtitle: "Join 10k students", primaryBtn: "Explore", secondaryBtn: "Demo", alignment: "left" },
    footer: { phone: "+91 12345 67890", email: "info@institute.com", address: "Delhi, India" }
  });

  const updateData = (section, field, value) => {
    setSiteData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const renderContent = () => {
    const props = { data: siteData[activeTab], update: (f, v) => updateData(activeTab, f, v) };
    switch (activeTab) {
      case "brand": return <BrandSettings {...props} />;
      case "hero": return <HeroSettings {...props} />;
      case "stats": return <StatsSettings {...props} />;
      case "footer": return <FooterSettings {...props} />;
      default: return <HeroSettings {...props} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 dark:bg-[#020617] overflow-hidden">
      
      {/* Center: The Workstation */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto p-6 lg:p-10">
          
          {/* Top Header Layer */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-200/60 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                <Globe size={20} />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Site Editor</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.0 Beta • Auto-Sync On</p>
              </div>
            </div>

            {/* Horizontal Navigation */}
            <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />

            <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100">
              <Save size={18} /> Deploy
            </button>
          </div>

          {/* Active Settings Form */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {renderContent()}
          </div>
        </div>
      </main>

    </div>
  );
}