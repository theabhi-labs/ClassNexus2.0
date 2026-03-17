import React, { useState, useEffect } from 'react';
import { 
  Download, Search, Shield, Award, Loader2, CheckCircle, 
  XCircle, Fingerprint, FileBadge, ArrowRight, Share2, Copy
} from 'lucide-react';

const CertificatePortal = () => {
  const [activeTab, setActiveTab] = useState('download');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const instituteName = "Guru Nanak Dev University";
  const instituteLogo = "GNDU";

  const fetchCertificate = async () => {
    setLoading(true);
    setError('');
    setCertificateData(null);
    setVerificationResult(null);
    
    // Premium delay feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (activeTab === 'download') {
      if (searchQuery === '2024001' || searchQuery === 'CERT001') {
        setCertificateData({
          id: 'CERT-882-001',
          studentName: 'Harpreet Singh',
          course: 'B.Tech Computer Science',
          grade: 'A+',
          issueDate: 'March 17, 2024',
          studentId: '2024001',
          hash: '0x882...bf12'
        });
      } else {
        setError('Record not found. Please verify the ID.');
      }
    } else if (activeTab === 'verify' && verifyId) {
      if (verifyId === 'CERT001' || verifyId === 'CERT-882-001') {
        setVerificationResult({
          valid: true,
          message: 'Certificate Signature Verified on Blockchain',
          details: {
            id: 'CERT-882-001',
            studentName: 'Harpreet Singh',
            course: 'B.Tech Computer Science',
            issueDate: 'March 17, 2024'
          }
        });
      } else {
        setVerificationResult({
          valid: false,
          message: 'Security Alert: This credential hash does not match our records.'
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* ─── 1. DYNAMIC BACKGROUND ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-100/40 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-purple-100/40 to-transparent blur-[120px]" />
      </div>

      {/* ─── 2. PREMIUM NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 group-hover:rotate-6 transition-transform duration-500">
              <span className="text-white font-black text-lg">{instituteLogo}</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">{instituteName}</h1>
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-indigo-500 mt-1 block">Digital Ledger Portal</span>
            </div>
          </div>

          <div className="hidden md:flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/40">
            {['download', 'verify'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError(''); setCertificateData(null); setVerificationResult(null); }}
                className={`flex items-center space-x-2 px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                  activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'download' ? <Download size={14}/> : <Shield size={14}/>}
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── 3. MAIN CONTENT ─── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
               <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Secure System Active</span>
               </div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                 {activeTab === 'download' ? 'Instant Credentials Retrieval.' : 'Verify Certificate Integrity.'}
               </h2>
               <p className="text-slate-500 text-lg font-medium leading-relaxed">
                 {activeTab === 'download' 
                   ? 'Access your official academic transcripts through our encrypted gateway.' 
                   : 'Validate digital signatures to ensure credential authenticity.'}
               </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white">
              <form onSubmit={(e) => { e.preventDefault(); fetchCertificate(); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Reference</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                      {activeTab === 'download' ? <Fingerprint size={20}/> : <FileBadge size={20}/>}
                    </div>
                    <input
                      type="text"
                      value={activeTab === 'download' ? searchQuery : verifyId}
                      onChange={(e) => activeTab === 'download' ? setSearchQuery(e.target.value) : setVerifyId(e.target.value)}
                      placeholder={activeTab === 'download' ? "Student ID (2024001)" : "Certificate ID (CERT001)"}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 outline-none font-bold text-slate-800 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-slate-950 hover:bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all duration-500 group relative overflow-hidden disabled:opacity-50"
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} className="group-hover:translate-x-1 transition-transform" />}
                    <span>{loading ? 'Processing...' : 'Start Search'}</span>
                  </div>
                </button>
              </form>

              {error && (
                <div className="mt-6 flex items-center space-x-3 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 animate-in zoom-in-95">
                  <XCircle size={18} />
                  <p className="text-xs font-black uppercase tracking-wider">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Display Side */}
          <div className="lg:col-span-7 lg:pl-10">
            {/* Empty State */}
            {!certificateData && !verificationResult && !loading && (
              <div className="relative group overflow-hidden bg-slate-100/40 rounded-[3rem] border-2 border-dashed border-slate-200 h-[500px] flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-1000">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-slate-200 flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Award className="text-indigo-500" size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-slate-900 font-black text-2xl tracking-tight mb-2">Ready for Discovery</h3>
                <p className="text-slate-400 font-medium max-w-xs">Your academic achievements will be rendered here in a high-fidelity preview.</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="space-y-8 animate-pulse">
                <div className="h-[400px] bg-slate-200/50 rounded-[3rem]" />
                <div className="h-24 bg-slate-200/50 rounded-3xl" />
              </div>
            )}

            {/* Certificate Display */}
            {certificateData && activeTab === 'download' && (
              <div className="space-y-6 animate-in zoom-in-95 duration-700">
                <div className="bg-slate-950 rounded-[3rem] p-1 shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                  {/* Certificate Inner Design */}
                  <div className="bg-[#121212] rounded-[2.8rem] p-12 text-white relative border border-white/5">
                    <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-indigo-600/20 blur-[100px]" />
                    
                    <div className="flex justify-between items-start mb-16 relative z-10">
                      <div>
                        <div className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Authentic Document</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter">Academic Transcript</h2>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl transition-all border border-white/10 group">
                           <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-10 relative z-10">
                      <div className="space-y-1">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Full Name of Graduate</p>
                        <p className="text-4xl font-black tracking-tight">{certificateData.studentName}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-1">
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Course of Study</p>
                          <p className="text-xl font-bold text-slate-200">{certificateData.course}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Classification</p>
                          <p className="text-3xl font-black text-indigo-400">{certificateData.grade}</p>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                              <Fingerprint size={20} className="text-indigo-400" />
                           </div>
                           <div className="text-[10px] font-mono text-slate-500">
                             <p>SHA-256 HASH</p>
                             <p className="font-bold">{certificateData.hash}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Issue Date</p>
                           <p className="text-sm font-bold text-slate-300">{certificateData.issueDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6">
                   <button className="flex items-center space-x-2 text-slate-400 hover:text-indigo-500 transition-colors">
                      <Share2 size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Share Publicly</span>
                   </button>
                   <button className="flex items-center space-x-2 text-slate-400 hover:text-indigo-500 transition-colors">
                      <Copy size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Copy Identifier</span>
                   </button>
                </div>
              </div>
            )}

            {/* Verification Result Display */}
            {verificationResult && activeTab === 'verify' && (
              <div className={`rounded-[3rem] p-10 border-2 transition-all duration-700 animate-in slide-in-from-right-12 ${
                verificationResult.valid 
                ? 'bg-emerald-50/30 border-emerald-200 shadow-2xl shadow-emerald-100' 
                : 'bg-rose-50/30 border-rose-200 shadow-2xl shadow-rose-100'
              }`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${
                    verificationResult.valid ? 'bg-emerald-500 text-white animate-bounce' : 'bg-rose-500 text-white animate-shake'
                  }`}>
                    {verificationResult.valid ? <CheckCircle size={48} /> : <XCircle size={48} />}
                  </div>
                  
                  <h3 className={`text-4xl font-black tracking-tighter mb-4 ${verificationResult.valid ? 'text-emerald-950' : 'text-rose-950'}`}>
                    {verificationResult.valid ? 'Verified Secure' : 'Verification Denied'}
                  </h3>
                  <p className="text-slate-500 font-bold mb-10 max-w-sm">{verificationResult.message}</p>

                  {verificationResult.valid && (
                     <div className="w-full bg-white rounded-[2rem] p-8 shadow-sm border border-emerald-100 space-y-4">
                        <div className="flex justify-between items-center py-2">
                           <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Verified Holder</span>
                           <span className="font-bold text-slate-900">{verificationResult.details.studentName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-50">
                           <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Official Issue</span>
                           <span className="font-bold text-slate-900">{verificationResult.details.issueDate}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-slate-50">
                           <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Encryption Key</span>
                           <span className="font-mono text-[10px] text-indigo-500 font-black bg-indigo-50 px-3 py-1 rounded-full uppercase">0x71-validated</span>
                        </div>
                     </div>
                  )}
                  
                  <button onClick={() => setVerificationResult(null)} className="mt-10 flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Reset Security Tunnel</span>
                     <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── 4. PREMIUM FOOTER ─── */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/50">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © 2026 {instituteName} • Infrastructure v4.2.0
            </p>
            <div className="flex space-x-8">
               <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">GDPR Compliance</a>
               <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Encryption Protocols</a>
               <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Public Ledger</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default CertificatePortal;