import React, { useState } from "react";
import { Award, Download, Loader2, ChevronRight } from "lucide-react";

const CertificateRow = ({ cert, courseTitle }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const backendBaseUrl = import.meta.env.VITE_API_BASE;
  const downloadUrl = `${backendBaseUrl}/api/v1/certificate/certificate/${cert.certificateId}`;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(downloadUrl, { method: "GET" });
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseTitle?.replace(/\s+/g, '_') || "Certificate"}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download Error:", err);
      alert("Could not download the certificate. Please check your connection.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-violet-50/50 to-white border border-violet-100 rounded-[2rem] group hover:shadow-lg hover:shadow-violet-100/50 transition-all gap-4">
      
      {/* Left Section: Icon & Info */}
      <div className="flex items-start gap-4 w-full sm:w-auto">
        <div className="bg-white p-3 rounded-2xl shadow-sm text-violet-600 flex-shrink-0 border border-violet-50 mt-0.5">
          <Award size={22} />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Mobile me pura name dikhane ke liye truncate hataya aur line-clamp lagaya */}
          <h4 className="font-black text-slate-800 text-sm leading-snug break-words sm:whitespace-normal">
            {courseTitle || "Course Certificate"}
          </h4>
          <div className="flex items-center gap-2 mt-1.5">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
               ID: <span className="text-violet-400/80">{cert.certificateId}</span>
             </p>
             {/* Subtle indicator for mobile */}
             <ChevronRight size={10} className="sm:hidden text-violet-200" />
          </div>
        </div>
      </div>
      
      {/* Right Section: Download Button */}
      <div className="flex items-center w-full sm:w-auto">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white px-5 py-3 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs font-black text-violet-600 border border-violet-200 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
        >
          {isDownloading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
          )}
          <span className="tracking-widest">
            {isDownloading ? "DOWNLOADING..." : "DOWNLOAD"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CertificateRow;