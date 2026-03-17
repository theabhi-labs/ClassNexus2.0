// CertificatePortal.jsx (Updated)
import React, { useState } from 'react';
import { 
  Download, Search, Shield, Award, Loader2, 
  Fingerprint, FileBadge, ArrowRight 
} from 'lucide-react';
import CertificateCard from '../components/Certificate/CertificateCard';
import VerificationCard from '../components/Certificate/VerificationCard';

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

  // Mock database of certificates
  const certificateDatabase = {
    '2024001': {
      id: 'CERT-882-001',
      studentName: 'Harpreet Singh',
      course: 'B.Tech Computer Science',
      grade: 'A+',
      issueDate: 'March 17, 2024',
      studentId: '2024001',
      hash: '0x8827f3e4a1b2c8d9e5f6a7b8c9d0e1f2a3b4c5d6'
    },
    '2024002': {
      id: 'CERT-882-002',
      studentName: 'Simran Kaur',
      course: 'MCA',
      grade: 'A',
      issueDate: 'March 17, 2024',
      studentId: '2024002',
      hash: '0x7736e2d3a1b2c8d9e5f6a7b8c9d0e1f2a3b4c5d6'
    },
    'CERT001': {
      id: 'CERT-882-001',
      studentName: 'Harpreet Singh',
      course: 'B.Tech Computer Science',
      grade: 'A+',
      issueDate: 'March 17, 2024',
      studentId: '2024001',
      hash: '0x8827f3e4a1b2c8d9e5f6a7b8c9d0e1f2a3b4c5d6'
    }
  };

  const fetchCertificate = async () => {
    setLoading(true);
    setError('');
    setCertificateData(null);
    setVerificationResult(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const query = activeTab === 'download' ? searchQuery : verifyId;
    const certificate = certificateDatabase[query];
    
    if (certificate) {
      if (activeTab === 'download') {
        setCertificateData(certificate);
      } else {
        setVerificationResult({
          valid: true,
          message: 'Certificate Signature Verified on Blockchain',
          details: certificate
        });
      }
    } else {
      if (activeTab === 'download') {
        setError('Record not found. Please verify the Student ID.');
      } else {
        setVerificationResult({
          valid: false,
          message: 'Security Alert: This credential hash does not match our records.'
        });
      }
    }
    
    setLoading(false);
  };

  const handleReset = () => {
    setCertificateData(null);
    setVerificationResult(null);
    setError('');
    setSearchQuery('');
    setVerifyId('');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-100/40 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-purple-100/40 to-transparent blur-[120px]" />
      </div>

      {/* Premium Navbar */}
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
                onClick={() => { 
                  setActiveTab(tab); 
                  handleReset();
                }}
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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Secure System Active
                </span>
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                {activeTab === 'download' ? 'Download Certificate.' : 'Verify Certificate.'}
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                {activeTab === 'download' 
                  ? 'Access your official certificate through our secure gateway.' 
                  : 'Validate digital signatures to ensure credential authenticity.'}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white">
              <form onSubmit={(e) => { e.preventDefault(); fetchCertificate(); }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {activeTab === 'download' ? 'Student ID' : 'Certificate ID'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                      {activeTab === 'download' ? <Fingerprint size={20}/> : <FileBadge size={20}/>}
                    </div>
                    <input
                      type="text"
                      value={activeTab === 'download' ? searchQuery : verifyId}
                      onChange={(e) => activeTab === 'download' ? setSearchQuery(e.target.value) : setVerifyId(e.target.value)}
                      placeholder={activeTab === 'download' ? "Enter Student ID (e.g., 2024001)" : "Enter Certificate ID (e.g., CERT001)"}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.5rem] ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 outline-none font-bold text-slate-800 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (activeTab === 'download' ? !searchQuery : !verifyId)}
                  className="w-full bg-slate-950 hover:bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all duration-500 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} className="group-hover:translate-x-1 transition-transform" />}
                    <span>{loading ? 'Processing...' : 'Search'}</span>
                  </div>
                </button>
              </form>

              {error && (
                <div className="mt-6 flex items-center space-x-3 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 animate-in zoom-in-95">
                  <XCircle size={18} />
                  <p className="text-xs font-black uppercase tracking-wider">{error}</p>
                </div>
              )}

              {/* Sample IDs for Testing */}
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Test Credentials
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => activeTab === 'download' ? setSearchQuery('2024001') : setVerifyId('CERT001')}
                    className="text-xs bg-white px-3 py-1 rounded-full border border-slate-200 hover:border-indigo-500 transition-colors"
                  >
                    {activeTab === 'download' ? 'Student: 2024001' : 'Certificate: CERT001'}
                  </button>
                </div>
              </div>
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
                <h3 className="text-slate-900 font-black text-2xl tracking-tight mb-2">
                  {activeTab === 'download' ? 'Ready to Download' : 'Ready to Verify'}
                </h3>
                <p className="text-slate-400 font-medium max-w-xs">
                  {activeTab === 'download' 
                    ? 'Enter your Student ID to view and download your certificate.' 
                    : 'Enter a Certificate ID to verify its authenticity.'}
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="space-y-8 animate-pulse">
                <div className="h-[500px] bg-slate-200/50 rounded-[3rem]" />
              </div>
            )}

            {/* Certificate Display */}
            {certificateData && activeTab === 'download' && (
              <CertificateCard 
                certificateData={certificateData} 
                onClose={handleReset}
              />
            )}

            {/* Verification Result */}
            {verificationResult && activeTab === 'verify' && (
              <VerificationCard 
                verificationResult={verificationResult}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            © 2026 {instituteName} • Blockchain Verified Certificates
          </p>
          <div className="flex space-x-8">
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
              Security
            </a>
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
              Verification
            </a>
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CertificatePortal;