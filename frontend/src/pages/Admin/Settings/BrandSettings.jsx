import React from 'react'
import { useState } from "react";
import { Upload } from "lucide-react";

export default function BrandSettings() {
  const [brand, setBrand] = useState({
    instituteName: "Your Institute Name",
    tagline: "Achieve Your Goals with Quality Education",
    primaryColor: "#2563eb",
    logo: null,
    favicon: null,
  });

  const handleChange = (field, value) => {
    setBrand({ ...brand, [field]: value });
  };

  const handleFileChange = (field, file) => {
    setBrand({ ...brand, [field]: file });
  };

  const handleSave = () => {
    console.log("Saved Brand Settings:", brand);
    alert("Brand Settings Saved Successfully!");
  };

  return (
    <div className="space-y-8">
      
      <h2 className="text-2xl font-bold">Brand Settings</h2>

      {/* Institute Name */}
      <div>
        <label className="block font-medium mb-2">
          Institute Name
        </label>
        <input
          type="text"
          value={brand.instituteName}
          onChange={(e) => handleChange("instituteName", e.target.value)}
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block font-medium mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={brand.tagline}
          onChange={(e) => handleChange("tagline", e.target.value)}
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Primary Color */}
      <div>
        <label className="block font-medium mb-2">
          Primary Theme Color
        </label>
        <input
          type="color"
          value={brand.primaryColor}
          onChange={(e) => handleChange("primaryColor", e.target.value)}
          className="w-20 h-12 border rounded-lg cursor-pointer"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block font-medium mb-2">
          Upload Logo
        </label>

        <label className="flex items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
          <Upload className="w-6 h-6 mr-2 text-gray-500" />
          <span className="text-gray-500">
            Click to upload logo
          </span>
          <input
            type="file"
            hidden
            onChange={(e) =>
              handleFileChange("logo", e.target.files[0])
            }
          />
        </label>

        {brand.logo && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {brand.logo.name}
          </p>
        )}
      </div>

      {/* Favicon Upload */}
      <div>
        <label className="block font-medium mb-2">
          Upload Favicon
        </label>

        <label className="flex items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
          <Upload className="w-6 h-6 mr-2 text-gray-500" />
          <span className="text-gray-500">
            Click to upload favicon
          </span>
          <input
            type="file"
            hidden
            onChange={(e) =>
              handleFileChange("favicon", e.target.files[0])
            }
          />
        </label>

        {brand.favicon && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {brand.favicon.name}
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Save Brand Settings
        </button>
      </div>

    </div>
  );
}