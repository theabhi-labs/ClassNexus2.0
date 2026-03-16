import React from 'react';

export default function SettingsNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "brand", label: "Brand" },
    { id: "hero", label: "Hero" },
    { id: "stats", label: "Stats" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-fit">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`
            px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300
            ${activeTab === item.id 
              ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}