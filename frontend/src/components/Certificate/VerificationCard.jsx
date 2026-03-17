// components/VerificationCard.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, Shield, Fingerprint, Calendar, User, Award } from 'lucide-react';

const VerificationCard = ({ verificationResult, onReset }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!verificationResult) return null;

  return (
    <div className={`rounded-[3rem] p-10 border-2 transition-all duration-700 animate-in slide-in-from-right-12 ${
      verificationResult.valid 
      ? 'bg-emerald-50/30 border-emerald-200 shadow-2xl shadow-emerald-100' 
      : 'bg-rose-50/30 border-rose-200 shadow-2xl shadow-rose-100'
    }`}>
      
      {/* Header Icon */}
      <div className="flex flex-col items-center text-center">
        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${
          verificationResult.valid 
          ? 'bg-emerald-500 text-white animate-bounce' 
          : 'bg-rose-500 text-white animate-shake'
        }`}>
          {verificationResult.valid ? <CheckCircle size={48} /> : <XCircle size={48} />}
        </div>
        
        {/* Status Message */}
        <h3 className={`text-4xl font-black tracking-tighter mb-4 ${
          verificationResult.valid ? 'text-emerald-950' : 'text-rose-950'
        }`}>
          {verificationResult.valid ? 'Verified Secure' : 'Verification Failed'}
        </h3>
        
        <p className="text-slate-500 font-bold mb-10 max-w-sm">
          {verificationResult.message}
        </p>

        {/* Valid Certificate Details */}
        {verificationResult.valid && verificationResult.details && (
          <div className="w-full bg-white rounded-[2rem] p-8 shadow-sm border border-emerald-100 space-y-6">
            
            {/* Student Name */}
            <div className="flex items-center justify-between py-3 border-b border-emerald-50">
              <div className="flex items-center space-x-3">
                <User size={18} className="text-emerald-500" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Verified Holder
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {verificationResult.details.studentName}
              </span>
            </div>

            {/* Course Details */}
            <div className="flex items-center justify-between py-3 border-b border-emerald-50">
              <div className="flex items-center space-x-3">
                <Award size={18} className="text-emerald-500" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Course
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {verificationResult.details.course}
              </span>
            </div>

            {/* Issue Date */}
            <div className="flex items-center justify-between py-3 border-b border-emerald-50">
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-emerald-500" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Issue Date
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {verificationResult.details.issueDate}
              </span>
            </div>

            {/* Certificate ID */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Fingerprint size={18} className="text-emerald-500" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Certificate ID
                </span>
              </div>
              <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                {verificationResult.details.id}
              </span>
            </div>

            {/* Blockchain Validation Badge */}
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl flex items-center justify-center space-x-2">
              <Shield size={16} className="text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                Blockchain Verified • Immutable Record
              </span>
            </div>
          </div>
        )}

        {/* Invalid Certificate Message */}
        {!verificationResult.valid && (
          <div className="w-full bg-rose-50 rounded-[2rem] p-8 text-center">
            <XCircle size={40} className="text-rose-400 mx-auto mb-4" />
            <p className="text-rose-600 font-bold mb-2">Security Alert</p>
            <p className="text-sm text-rose-500">
              The provided certificate ID does not match any record in our secure database. 
              Please verify the ID and try again.
            </p>
          </div>
        )}
        
        {/* Reset Button */}
        <button 
          onClick={onReset} 
          className="mt-10 flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Verify Another Certificate
          </span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default VerificationCard;