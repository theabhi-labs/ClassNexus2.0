
import React, { useState, useEffect } from 'react';
import { 
  Download, Search, Shield, Award, Loader2, 
  Fingerprint, FileBadge, ArrowRight, XCircle,
  CheckCircle, AlertTriangle, Copy, ExternalLink,
  Calendar, User, BookOpen, Hash, QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getCertificate, 
  verifyCertificate,
  getCertificateByEnrollment 
} from '../api/certificate.api';


const CertificatePortal = () => {
  const [activeTab, setActiveTab] = useState('download');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyId, setVerifyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(false);

  const instituteName = "JAS COMPUTER";
  const instituteLogo = "JC";

  // Fetch certificate by enrollment number
  const fetchCertificate = async () => {
    setLoading(true);
    setError('');
    setCertificateData(null);
    setVerificationResult(null);
    
    const query = activeTab === 'download' ? searchQuery : verifyId;
    
    if (!query) {
      setError('Please enter a valid ID');
      setLoading(false);
      return;
    }
    
    try {
      if (activeTab === 'download') {
        // Get certificate by enrollment number
        const res = await getCertificateByEnrollment(query);
        
        if (res?.data?.data) {
          const certData = res.data.data;
          setCertificateData({
            id: certData.certificateId,
            studentName: certData.studentDetails?.name || 'N/A',
            course: certData.course?.name || 'N/A',
            grade: certData.grade || 'A+',
            issueDate: new Date(certData.issueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            studentId: certData.enrollmentNumber,
            hash: certData._id,
            verificationUrl: certData.verificationUrl,
            qrCode: certData.qrCode?.imageUrl,
            issuedBy: certData.issuedBy?.name,
            issuingOrganization: certData.issuingOrganization?.name,
            duration: certData.course?.duration,
            level: certData.course?.level,
            mode: certData.course?.mode
          });
          toast.success('Certificate found successfully!');
        } else {
          setError('Certificate not found. Please verify the enrollment number.');
        }
      } else {
        // Verify certificate by certificate ID
        const res = await verifyCertificate(query);
        
        if (res?.data?.data) {
          const verifyData = res.data.data;
          setVerificationResult({
            valid: verifyData.isValid,
            message: verifyData.isValid 
              ? '✓ Certificate Signature Verified Successfully' 
              : '✗ Certificate verification failed',
            details: {
              certificateId: verifyData.certificateId,
              studentName: verifyData.studentDetails?.name,
              course: verifyData.course?.name,
              issueDate: new Date(verifyData.issueDate).toLocaleDateString(),
              verificationCount: verifyData.verificationStats?.totalScans || 0,
              lastVerified: verifyData.verificationStats?.lastVerified,
              issuer: verifyData.issuedBy?.name,
              organization: verifyData.issuingOrganization?.name
            }
          });
          
          if (verifyData.isValid) {
            toast.success('Certificate verified successfully!');
          } else {
            toast.error('Invalid certificate detected!');
          }
        } else {
          setVerificationResult({
            valid: false,
            message: 'Security Alert: This credential does not exist in our records.',
            details: null
          });
          toast.error('Certificate not found in system');
        }
      }
    } catch (error) {
      console.error('Certificate fetch error:', error);
      setError(error?.response?.data?.message || 'Failed to fetch certificate. Please try again.');
      toast.error('Failed to fetch certificate');
    } finally {
      setLoading(false);
    }
  };

  // Handle certificate download
  const handleDownload = async () => {
    if (!certificateData?.id) {
      toast.error('No certificate available to download');
      return;
    }
    
    setDownloadProgress(true);
    try {
      const res = await getCertificate(certificateData.id);
      
      if (res?.data) {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificate_${certificateData.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Certificate downloaded successfully!');
      } else {
        throw new Error('No PDF data received');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download certificate');
    } finally {
      setDownloadProgress(false);
    }
  };

  // Copy verification URL to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Reset form
  const handleReset = () => {
    setCertificateData(null);
    setVerificationResult(null);
    setError('');
    setSearchQuery('');
    setVerifyId('');
  };

  // Sample test data for quick testing
  const testCredentials = {
    download: {
      enrollmentNumber: 'JAS0326002',
      studentName: 'Raghav'
    },
    verify: {
      certificateId: 'CERT-2026-466E1B47'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-100/40 to-transparent blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-purple-100/40 to-transparent blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 group cursor-pointer">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform duration-500">
              <span className="text-white font-black text-lg sm:text-xl">{instituteLogo}</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                {instituteName}
              </h1>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-black text-indigo-500 mt-0.5 block">
                Digital Ledger Portal
              </span>
            </div>
          </div>

          <div className="flex bg-slate-100/50 p-1 rounded-xl sm:rounded-2xl border border-slate-200/40">
            {['download', 'verify'].map((tab) => (
              <button
                key={tab}
                onClick={() => { 
                  setActiveTab(tab); 
                  handleReset();
                }}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-500 ${
                  activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100 scale-[1.02]' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'download' ? <Download size={14}/> : <Shield size={14}/>}
                <span className="hidden sm:inline">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  Secure System Active
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                {activeTab === 'download' ? 'Download Certificate.' : 'Verify Certificate.'}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-slate-500 font-medium leading-relaxed">
                {activeTab === 'download' 
                  ? 'Access your official certificate through our secure gateway.' 
                  : 'Validate digital signatures to ensure credential authenticity.'}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 shadow-xl border border-white/50">
              <form onSubmit={(e) => { e.preventDefault(); fetchCertificate(); }} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">
                    {activeTab === 'download' ? 'Enrollment Number / Student ID' : 'Certificate ID'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300">
                      {activeTab === 'download' ? <Fingerprint size={18} className="sm:w-5 sm:h-5"/> : <FileBadge size={18} className="sm:w-5 sm:h-5"/>}
                    </div>
                    <input
                      type="text"
                      value={activeTab === 'download' ? searchQuery : verifyId}
                      onChange={(e) => activeTab === 'download' ? setSearchQuery(e.target.value) : setVerifyId(e.target.value)}
                      placeholder={activeTab === 'download' ? "Enter Enrollment Number (e.g., JAS0326002)" : "Enter Certificate ID (e.g., CERT-2026-466E1B47)"}
                      className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-slate-50 border-none rounded-xl sm:rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 outline-none font-semibold text-sm sm:text-base text-slate-800 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || (activeTab === 'download' ? !searchQuery : !verifyId)}
                  className="w-full bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-indigo-600 hover:to-indigo-700 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm transition-all duration-500 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-3">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} className="group-hover:translate-x-1 transition-transform" />}
                    <span>{loading ? 'Processing...' : 'Search & Verify'}</span>
                  </div>
                </button>
              </form>

              {error && (
                <div className="mt-4 sm:mt-6 flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-rose-50 text-rose-600 rounded-xl sm:rounded-2xl border border-rose-100 animate-in zoom-in-95">
                  <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider">{error}</p>
                </div>
              )}

              {/* Sample IDs for Testing */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Test Credentials
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => activeTab === 'download' 
                      ? setSearchQuery(testCredentials.download.enrollmentNumber) 
                      : setVerifyId(testCredentials.verify.certificateId)
                    }
                    className="text-[10px] sm:text-xs bg-white px-2.5 sm:px-3 py-1 rounded-full border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    {activeTab === 'download' 
                      ? `Enrollment: ${testCredentials.download.enrollmentNumber}` 
                      : `Certificate: ${testCredentials.verify.certificateId.substring(0, 20)}...`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Display Side */}
          <div className="lg:col-span-7 lg:pl-10">
            {/* Empty State */}
            {!certificateData && !verificationResult && !loading && (
              <div className="relative group overflow-hidden bg-slate-100/40 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 min-h-[400px] sm:h-[500px] flex flex-col items-center justify-center p-6 sm:p-12 text-center animate-in fade-in duration-1000">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200 flex items-center justify-center mb-4 sm:mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Award className="text-indigo-500" size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-slate-900 font-black text-xl sm:text-2xl tracking-tight mb-2">
                  {activeTab === 'download' ? 'Ready to Download' : 'Ready to Verify'}
                </h3>
                <p className="text-slate-400 font-medium text-sm max-w-xs">
                  {activeTab === 'download' 
                    ? 'Enter your enrollment number to view and download your certificate.' 
                    : 'Enter a certificate ID to verify its authenticity on blockchain.'}
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="space-y-4 sm:space-y-8 animate-pulse">
                <div className="h-[400px] sm:h-[500px] bg-slate-200/50 rounded-2xl sm:rounded-3xl" />
              </div>
            )}

            {/* Certificate Display */}
            {certificateData && activeTab === 'download' && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Certificate Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 sm:p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs sm:text-sm opacity-90">Certificate of Achievement</p>
                      <h3 className="text-lg sm:text-2xl font-bold mt-1">{certificateData.id}</h3>
                    </div>
                    <div className="bg-white/20 rounded-xl p-2">
                      <Award size={24} className="sm:w-8 sm:h-8" />
                    </div>
                  </div>
                </div>
                
                {/* Certificate Body */}
                <div className="p-5 sm:p-8 space-y-4 sm:space-y-6">
                  <div className="text-center border-b border-slate-100 pb-4 sm:pb-6">
                    <h4 className="text-xl sm:text-3xl font-black text-slate-900">{certificateData.studentName}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">has successfully completed</p>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="text-indigo-500 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Course</p>
                        <p className="text-sm sm:text-base font-semibold text-slate-900">{certificateData.course}</p>
                        {certificateData.level && (
                          <p className="text-xs text-slate-500 mt-1">Level: {certificateData.level}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="text-indigo-500 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Issue Date</p>
                        <p className="text-sm sm:text-base font-semibold text-slate-900">{certificateData.issueDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Hash className="text-indigo-500 mt-0.5" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Certificate Hash</p>
                        <p className="text-xs font-mono text-slate-600 break-all">{certificateData.hash}</p>
                      </div>
                    </div>
                    
                    {certificateData.qrCode && (
                      <div className="flex justify-center py-4">
                        <img src={certificateData.qrCode} alt="QR Code" className="w-24 h-24 sm:w-32 sm:h-32" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleDownload}
                      disabled={downloadProgress}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {downloadProgress ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Download size={18} />
                      )}
                      {downloadProgress ? 'Downloading...' : 'Download Certificate'}
                    </button>
                    
                    {certificateData.verificationUrl && (
                      <button
                        onClick={() => copyToClipboard(certificateData.verificationUrl)}
                        className="flex-1 border-2 border-indigo-200 text-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Copy size={18} />
                        Copy Verify URL
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 sm:p-4 text-center border-t border-slate-100">
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    This certificate is digitally signed and blockchain verified
                  </p>
                </div>
              </div>
            )}

            {/* Verification Result */}
            {verificationResult && activeTab === 'verify' && (
              <div className={`rounded-2xl sm:rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-500 ${
                verificationResult.valid 
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200' 
                  : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-200'
              }`}>
                <div className="p-5 sm:p-8">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    {verificationResult.valid ? (
                      <CheckCircle className="text-emerald-600" size={32} />
                    ) : (
                      <AlertTriangle className="text-rose-600" size={32} />
                    )}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                        {verificationResult.valid ? 'Certificate Verified' : 'Verification Failed'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">{verificationResult.message}</p>
                    </div>
                  </div>
                  
                  {verificationResult.details && (
                    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500">Certificate ID</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 break-all">{verificationResult.details.certificateId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500">Student Name</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{verificationResult.details.studentName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500">Course</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{verificationResult.details.course}</p>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-500">Issue Date</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">{verificationResult.details.issueDate}</p>
                        </div>
                      </div>
                      
                      {verificationResult.details.verificationCount > 0 && (
                        <div className="bg-white/50 rounded-xl p-3 sm:p-4">
                          <p className="text-[10px] sm:text-xs text-slate-500">Verification Statistics</p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900">
                            This certificate has been verified {verificationResult.details.verificationCount} time(s)
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          if (verificationResult.details.certificateId) {
                            navigator.clipboard.writeText(verificationResult.details.certificateId);
                            toast.success('Certificate ID copied!');
                          }
                        }}
                        className="w-full bg-white/80 text-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy Certificate ID
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-slate-200/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center">
            © 2026 {instituteName} • Blockchain Verified Certificates
          </p>
          <div className="flex space-x-6 sm:space-x-8">
            <a href="#" className="text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors">
              Security
            </a>
            <a href="#" className="text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors">
              Verification
            </a>
            <a href="#" className="text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-wider transition-colors">
              Help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CertificatePortal;