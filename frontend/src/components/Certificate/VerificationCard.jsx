// components/Certificate/VerificationCard.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink, ShieldCheck, Award, Calendar, User, BookOpen, Hash, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const VerificationCard = ({ verificationResult, onReset }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isValid = verificationResult?.valid || verificationResult?.isValid;
  const details = verificationResult?.details;
  const message = verificationResult?.message;

  return (
    <div className="max-w-2xl mx-auto p-4 animate-in zoom-in-95 duration-500">
      <div className={`rounded-2xl shadow-2xl overflow-hidden border-2 ${
        isValid 
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200' 
          : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200'
      }`}>
        
        {/* Header */}
        <div className="p-6 text-center border-b border-white/50">
          <div className="flex justify-center mb-4">
            {isValid ? (
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="text-emerald-600" size={40} />
              </div>
            ) : (
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
                <XCircle className="text-rose-600" size={40} />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isValid ? '✓ Certificate Verified' : '✗ Verification Failed'}
          </h2>
          
          <p className={`text-sm ${isValid ? 'text-emerald-700' : 'text-rose-700'} font-medium`}>
            {message || (isValid 
              ? 'This certificate is authentic and verified on the blockchain' 
              : 'This certificate could not be verified. Please check the ID and try again.')}
          </p>
        </div>

        {/* Certificate Details */}
        {isValid && details && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              Certificate Details
            </h3>
            
            <div className="space-y-3">
              {/* Certificate ID */}
              <div className="flex items-start justify-between p-3 bg-white/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Certificate ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    {details.certificateId || details.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(details.certificateId || details.id)}
                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                    title="Copy ID"
                  >
                    <Copy size={12} className="text-slate-400" />
                  </button>
                </div>
              </div>
              
              {/* Student Name */}
              {details.studentName && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Student Name</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{details.studentName}</span>
                </div>
              )}
              
              {/* Course */}
              {details.course && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Course</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{details.course}</span>
                </div>
              )}
              
              {/* Issue Date */}
              {details.issueDate && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Issue Date</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{formatDate(details.issueDate)}</span>
                </div>
              )}
              
              {/* Issuer */}
              {details.issuer && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Issued By</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{details.issuer}</span>
                </div>
              )}
              
              {/* Verification Stats */}
              {details.verificationCount !== undefined && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-500">Times Verified</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{details.verificationCount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invalid Certificate Details */}
        {!isValid && details && (
          <div className="p-6">
            <div className="bg-rose-100/50 rounded-xl p-4">
              <p className="text-sm text-rose-700">
                {details.message || 'The certificate ID you entered does not match any record in our system.'}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/50 flex gap-3">
          {isValid && details?.certificateId && (
            <button
              onClick={() => window.open(`/verify/${details.certificateId}`, '_blank')}
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">View Full Certificate</span>
            </button>
          )}
          
          <button
            onClick={onReset}
            className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-sm font-medium">Verify Another</span>
          </button>
        </div>
        
        {/* Blockchain Badge */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck size={10} />
            <span>Blockchain Verified</span>
            <span>•</span>
            <span>Tamper-Proof</span>
            <span>•</span>
            <span>Digital Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;