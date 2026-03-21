// components/Certificate/CertificateCard.jsx
import React, { useRef, useState } from 'react';
import { Copy, Printer, ShieldCheck, Award, Fingerprint, CheckCircle, Download, ExternalLink, Loader2, Calendar, User, BookOpen, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateCard = ({ certificateData, onClose, onDownload }) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Format date from backend
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get grade from backend data
  const getGrade = () => {
    // If grade exists in backend, use it, else calculate based on performance
    if (certificateData.grade) return certificateData.grade;
    return 'A+'; // Default
  };

  // Get duration from backend
  const getDuration = () => {
    if (certificateData.duration) {
      return `${certificateData.duration.value} ${certificateData.duration.unit}`;
    }
    return '3 months';
  };

  // Copy certificate ID to clipboard
  const copyToClipboard = async () => {
    const certId = certificateData.certificateId || certificateData.id;
    try {
      await navigator.clipboard.writeText(certId);
      setIsCopied(true);
      toast.success('Certificate ID copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Generate PDF using html2canvas
  const generatePDF = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate_${certificateData.certificateId || certificateData.id}.pdf`);
      
      toast.success('Certificate downloaded successfully!');
      if (onDownload) onDownload();
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  // Print certificate
  const printCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow pop-ups to print');
      return;
    }

    const printContent = certificateRef.current.cloneNode(true);
    
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificateData.studentName || certificateData.studentDetails?.name}</title>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              background: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              font-family: 'Times New Roman', serif;
            }
            @media print {
              body { padding: 0; margin: 0; }
              .no-print { display: none !important; }
            }
            .certificate-preview {
              max-width: 1100px;
              margin: 0 auto;
              box-shadow: none;
            }
            /* Certificate Styles */
            .cert-container {
              background: white;
              padding: 40px;
              border: 20px double #c5a059;
              position: relative;
            }
            .cert-header { text-align: center; margin-bottom: 30px; }
            .cert-title { font-size: 48px; color: #c5a059; font-weight: bold; margin: 20px 0; }
            .student-name { font-size: 36px; color: #1e3a8a; margin: 30px 0; border-bottom: 2px solid #c5a059; display: inline-block; }
            .course-name { font-size: 24px; font-weight: bold; margin: 20px 0; }
            .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; text-align: center; }
            .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="certificate-preview">
            ${printContent.outerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 500);
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  // Get data from backend structure
  const studentName = certificateData.studentName || certificateData.studentDetails?.name || 'Student';
  const courseName = certificateData.course || certificateData.course?.name || 'Course';
  const certificateId = certificateData.certificateId || certificateData.id;
  const enrollmentNumber = certificateData.enrollmentNumber || certificateData.studentId;
  const issueDate = certificateData.issueDate;
  const grade = certificateData.grade || 'A+';
  const verificationUrl = certificateData.verificationUrl;
  const issuedBy = certificateData.issuedBy?.name || 'Admin';
  const organization = certificateData.issuingOrganization?.name || 'JAS COMPUTER';
  const level = certificateData.level || certificateData.course?.level;
  const mode = certificateData.mode || certificateData.course?.mode;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in slide-in-from-right-8 duration-500">
      {/* Certificate Preview Card */}
      <div 
        ref={certificateRef}
        className="bg-gradient-to-br from-white to-slate-50 border-8 border-double border-amber-200 shadow-2xl rounded-lg overflow-hidden relative group"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <Award size={150} className="text-amber-700" />
        </div>
        <div className="absolute bottom-0 left-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <ShieldCheck size={150} className="text-amber-700" />
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 text-center p-8 md:p-12">
          {/* Institute Logo/Badge */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">JC</span>
            </div>
          </div>
          
          {/* Institute Name */}
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 mb-1 tracking-wide">
            {organization}
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-6">
            Blockchain Verified Certificate
          </p>
          
          {/* Certificate Title */}
          <div className="mb-6">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-amber-700 mb-2 tracking-wider">
              CERTIFICATE
            </h2>
            <p className="text-sm text-slate-500 uppercase tracking-[0.3em]">
              OF ACHIEVEMENT
            </p>
          </div>
          
          {/* Description */}
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-4">
            This is to certify that
          </p>
          
          {/* Student Name */}
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-amber-700 my-4 border-b-2 border-amber-200 inline-block px-8">
            {studentName}
          </h3>
          
          {/* Course Details */}
          <p className="text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed">
            Has successfully completed the professional course in
          </p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 mt-2 mb-4">
            {courseName}
          </p>
          
          {/* Additional Details from Backend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8 mb-8">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Grade</p>
              <p className={`text-xl font-bold text-emerald-600`}>
                {grade}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Issue Date</p>
              <p className="text-sm font-semibold text-slate-700">
                {formatDate(issueDate)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Enrollment No</p>
              <p className="text-sm font-mono text-slate-600">
                {enrollmentNumber || 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Duration</p>
              <p className="text-sm font-semibold text-slate-700">
                {getDuration()}
              </p>
            </div>
          </div>
          
          {/* Additional Info if available */}
          {(level || mode) && (
            <div className="flex justify-center gap-4 mb-6">
              {level && (
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                  Level: {level}
                </span>
              )}
              {mode && (
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                  Mode: {mode}
                </span>
              )}
            </div>
          )}
          
          {/* Signature Section */}
          <div className="flex justify-between items-end mt-8 pt-8 border-t border-amber-200">
            <div className="text-center">
              <div className="w-32 h-px bg-slate-300 mb-2"></div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Course Instructor</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{issuedBy}</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Fingerprint className="text-amber-500" size={24} />
              </div>
              <p className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                ID: {certificateId?.substring(0, 16)}...
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-px bg-slate-300 mb-2"></div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Director</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{organization}</p>
            </div>
          </div>
          
          {/* Blockchain Verification Badge */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={12} />
              <span>Blockchain Verified Certificate</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Digitally Signed</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Tamper-Proof</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        {/* Download PDF Button */}
        <button
          onClick={generatePDF}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 md:px-8 py-3 rounded-full hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Download size={20} />
          )}
          <span className="font-semibold uppercase text-sm tracking-wider">
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </span>
        </button>
        
        {/* Print Button */}
        <button
          onClick={printCertificate}
          className="flex items-center justify-center gap-2 bg-slate-800 text-white px-6 md:px-8 py-3 rounded-full hover:bg-slate-900 transition-all shadow-lg"
        >
          <Printer size={20} />
          <span className="font-semibold uppercase text-sm tracking-wider">Print</span>
        </button>
        
        {/* Copy ID Button */}
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 border-2 border-amber-200 text-amber-700 px-6 md:px-8 py-3 rounded-full hover:bg-amber-50 transition-all"
        >
          {isCopied ? <CheckCircle size={18} /> : <Copy size={18} />}
          <span className="font-medium text-sm">
            {isCopied ? 'Copied!' : 'Copy Certificate ID'}
          </span>
        </button>
      </div>
      
      {/* Verification Link */}
      {verificationUrl && (
        <div className="mt-6 text-center">
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ExternalLink size={12} />
            Verify Certificate Online
          </a>
        </div>
      )}
    </div>
  );
};

export default CertificateCard;