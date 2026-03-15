import React from 'react'
import { Home, BarChart3, Image, Phone } from "lucide-react";

export default function SettingsNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "brand", label: "Brand", icon: Image },
    { id: "hero", label: "Hero", icon: Home },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "footer", label: "Footer", icon: Phone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center text-xs transition-all duration-200 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}