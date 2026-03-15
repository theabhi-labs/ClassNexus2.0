import React from 'react'
import { useState } from "react";
import SettingsNav from "./SettingsNav";
import HeroSettings from "./HeroSettings";
import BrandSettings from "./BrandSettings";
import StatsSettings from "./StatsSettings";
import FooterSettings from "./FooterSettings";
import LivePreview from "./LivePreview";


export default function Settings() {
  const [activeTab, setActiveTab] = useState("hero");

  const renderContent = () => {
    switch (activeTab) {
      case "brand":
        return <BrandSettings />;
      case "hero":
        return <HeroSettings />;
      case "stats":
        return <StatsSettings />;
      case "footer":
        return <FooterSettings />;
      default:
        return <HeroSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex">
        
        <div className="w-2/3 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-md p-8">
            {renderContent()}
          </div>
        </div>

        <div className="w-1/3 p-6 border-l bg-gray-50">
          <LivePreview />
        </div>
      </div>
    </div>
  );
}
