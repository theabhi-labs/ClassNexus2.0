import React, { useState } from 'react';
import { 
  Facebook, Instagram, Twitter, Youtube, 
  MapPin, Phone, Mail, Info, Share2, Save, 
  ArrowRight, Globe
} from "lucide-react";

export default function FooterSettings() {
  const [footer, setFooter] = useState({
    aboutText: "Leading Coaching Institute providing quality education for over 10 years.",
    phone: "+91 12345 67890",
    email: "info@institute.com",
    address: "Your Institute Address Here, City, State - 110001",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
    },
  });

  const handleChange = (field, value) => {
    setFooter({ ...footer, [field]: value });
  };

  const handleSocialChange = (platform, value) => {
    setFooter({
      ...footer,
      socialLinks: { ...footer.socialLinks, [platform]: value },
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Footer & Connect</h2>
          <p className="text-slate-500 font-medium">Manage how the world contacts and follows your institute.</p>
        </div>
        <button
          onClick={() => alert("Settings Synced!")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: About & Contact */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600">
                <Info size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">About the Institute</h3>
            </div>
            <textarea
              rows="4"
              value={footer.aboutText}
              onChange={(e) => handleChange("aboutText", e.target.value)}
              placeholder="Tell your students who you are..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl px-5 py-4 text-sm font-medium transition-all resize-none"
            />
          </div>

          {/* Contact Details Grid */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Contact Channels</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={footer.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="email"
                    value={footer.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Physical Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <textarea
                    rows="2"
                    value={footer.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-indigo-500 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Social Media */}
        <div className="space-y-8">
          <div className="bg-slate-900 dark:bg-indigo-950 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
            <Share2 className="absolute -right-4 -top-4 text-white opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700" size={120} />
            
            <h3 className="text-xl font-bold mb-2 relative z-10">Social Presence</h3>
            <p className="text-slate-400 text-xs font-medium mb-8 relative z-10">Connect your community across all platforms.</p>

            <div className="space-y-5 relative z-10">
              {[
                { id: 'facebook', icon: Facebook, color: 'hover:bg-blue-600', label: 'Facebook' },
                { id: 'instagram', icon: Instagram, color: 'hover:bg-pink-600', label: 'Instagram' },
                { id: 'twitter', icon: Twitter, color: 'hover:bg-sky-500', label: 'Twitter / X' },
                { id: 'youtube', icon: Youtube, color: 'hover:bg-red-600', label: 'YouTube' },
              ].map((social) => (
                <div key={social.id} className="group/item">
                  <div className="flex items-center gap-3 mb-1.5 px-1">
                    <social.icon size={14} className="text-slate-400 group-hover/item:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{social.label}</span>
                  </div>
                  <input
                    type="text"
                    placeholder={`https://${social.id}.com/your-page`}
                    value={footer.socialLinks[social.id]}
                    onChange={(e) => handleSocialChange(social.id, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:bg-white/10 focus:border-white/20 focus:ring-0 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-slate-500 italic uppercase">
              <span>Links Verified</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}