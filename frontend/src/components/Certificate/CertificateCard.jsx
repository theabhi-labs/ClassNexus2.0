// components/Certificate/CertificateCard.jsx
import React, { useRef } from 'react';
import { Download, Copy, Fingerprint, Printer } from 'lucide-react';

const CertificateCard = ({ certificateData }) => {
  const certificateRef = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(certificateData.id);
    alert('Certificate ID copied to clipboard!');
  };

  const printCertificate = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow pop-ups to print certificate');
      return;
    }

    const certificateHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${certificateData.studentName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f0f0f0;
              padding: 20px;
            }
            .certificate-wrapper {
              width: 1100px;
              background: white;
              padding: 40px;
              border: 15px solid #1e3a8a;
              position: relative;
              box-shadow: 0 0 30px rgba(0,0,0,0.2);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #1e3a8a;
              padding-bottom: 20px;
            }
            .logo-section {
              text-align: center;
            }
            .logo {
              width: 80px;
              height: 80px;
              background: #1e3a8a;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              font-weight: bold;
              border-radius: 20px;
              margin-bottom: 5px;
            }
            .certified-badge {
              font-size: 12px;
              color: #1e3a8a;
              border: 1px solid #1e3a8a;
              padding: 3px 8px;
              border-radius: 4px;
            }
            .center-info {
              text-align: right;
            }
            .center-name {
              font-size: 22px;
              color: #1e3a8a;
              font-weight: bold;
            }
            .center-tagline {
              font-size: 14px;
              color: #666;
              font-style: italic;
            }
            .center-address {
              font-size: 12px;
              color: #888;
            }
            .title-section {
              text-align: center;
              margin: 30px 0;
            }
            .title {
              font-size: 36px;
              color: #1e3a8a;
              font-weight: bold;
              border-bottom: 3px solid #1e3a8a;
              display: inline-block;
              padding-bottom: 10px;
            }
            .subtitle {
              font-size: 18px;
              color: #666;
              margin-top: 15px;
            }
            .student-section {
              text-align: center;
              margin: 30px 0;
            }
            .student-name {
              font-size: 42px;
              color: #1e3a8a;
              font-weight: bold;
              border-bottom: 2px dashed #1e3a8a;
              display: inline-block;
              padding-bottom: 5px;
            }
            .enrollment {
              font-size: 16px;
              color: #666;
              margin-top: 10px;
            }
            .completion-section {
              text-align: center;
              margin: 30px 0;
            }
            .completion-text {
              font-size: 18px;
              color: #333;
              margin: 5px 0;
            }
            .course-name {
              font-size: 28px;
              color: white;
              background: #1e3a8a;
              padding: 10px 30px;
              display: inline-block;
              border-radius: 5px;
              margin: 10px 0;
            }
            .duration {
              font-size: 16px;
              color: #666;
            }
            .coverage-section {
              margin: 30px 0;
            }
            .section-title {
              font-size: 18px;
              color: #1e3a8a;
              font-weight: bold;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .coverage-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              padding-left: 20px;
            }
            .coverage-item {
              font-size: 14px;
              color: #444;
            }
            .performance-section {
              margin: 30px 0;
            }
            .performance-grid {
              display: flex;
              justify-content: space-between;
              padding-left: 20px;
            }
            .performance-item {
              font-size: 15px;
            }
            .performance-label {
              font-weight: bold;
              color: #1e3a8a;
            }
            .certificate-id {
              text-align: right;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
              margin: 30px 0;
            }
            .signatures {
              display: flex;
              justify-content: space-between;
              margin: 50px 0 20px;
            }
            .signature {
              width: 200px;
              text-align: center;
            }
            .signature-line {
              width: 100%;
              height: 1px;
              background: #333;
              margin-bottom: 10px;
            }
            .signature-title {
              font-size: 14px;
              color: #333;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              color: #999;
              border-top: 1px dashed #ddd;
              padding-top: 10px;
            }
            @media print {
              body { background: white; padding: 0; }
              .certificate-wrapper { border: 15px solid #1e3a8a; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-wrapper">
            <!-- Header -->
            <div class="header">
              <div class="logo-section">
                <div class="logo">GNDU</div>
                <div class="certified-badge">ISO 9001:2015 Certified</div>
              </div>
              <div class="center-info">
                <div class="center-name">Guru Nanak Dev University</div>
                <div class="center-tagline">(Empowering Skills for the Digital Future)</div>
                <div class="center-address">Amritsar, Punjab | Contact: +91 1234567890 | www.gndu.ac.in</div>
              </div>
            </div>

            <!-- Title -->
            <div class="title-section">
              <div class="title">CERTIFICATE OF COMPLETION</div>
              <div class="subtitle">This is to proudly certify that</div>
            </div>

            <!-- Student -->
            <div class="student-section">
              <div class="student-name">${certificateData.studentName}</div>
              <div class="enrollment">Enrollment No: [${certificateData.studentId}]</div>
            </div>

            <!-- Completion -->
            <div class="completion-section">
              <div class="completion-text">has successfully completed the course</div>
              <div class="course-name">${certificateData.course}</div>
              <div class="duration">conducted at [Guru Nanak Dev University] from [01 Jan 2024] to [31 Dec 2024].</div>
            </div>

            <!-- Course Coverage -->
            <div class="coverage-section">
              <div class="section-title">Course Coverage:</div>
              <div class="coverage-grid">
                <div class="coverage-item">• Computer Fundamentals</div>
                <div class="coverage-item">• MS Word, Excel & PowerPoint</div>
                <div class="coverage-item">• Internet & Email Management</div>
                <div class="coverage-item">• Typing & Documentation</div>
                <div class="coverage-item">• Practical Assignments</div>
                <div class="coverage-item">• Final Project</div>
              </div>
            </div>

            <!-- Performance -->
            <div class="performance-section">
              <div class="section-title">Performance Record:</div>
              <div class="performance-grid">
                <div class="performance-item">
                  <span class="performance-label">Attendance:</span> 95%
                </div>
                <div class="performance-item">
                  <span class="performance-label">Grade:</span> ${certificateData.grade}
                </div>
                <div class="performance-item">
                  <span class="performance-label">Project Status:</span> Successfully Completed
                </div>
              </div>
            </div>

            <!-- Certificate ID -->
            <div class="certificate-id">
              Certificate ID: ${certificateData.id}
            </div>

            <!-- Signatures -->
            <div class="signatures">
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">Course Instructor</div>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-title">Director (Authorized Signatory)</div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              This certificate is digitally generated and does not require a physical signature
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(certificateHTML);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Certificate Display */}
      <div ref={certificateRef} className="bg-[#0f172a] rounded-[3rem] p-1 shadow-2xl shadow-indigo-200">
        <div className="bg-[#0a0f1c] rounded-[2.8rem] p-12 text-white border border-[#1e293b]">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-16">
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30 mb-4">
                <span className="text-[10px] font-black uppercase text-indigo-400">
                  ISO 9001:2015 Certified
                </span>
              </div>
              <h2 className="text-3xl font-black">CERTIFICATE OF COMPLETION</h2>
            </div>
          </div>

          {/* Student Details */}
          <div className="text-center mb-12">
            <p className="text-gray-400 text-sm mb-2">This is to proudly certify that</p>
            <p className="text-5xl font-black text-indigo-400 mb-2">
              {certificateData.studentName}
            </p>
            <p className="text-gray-500">Enrollment No: [{certificateData.studentId}]</p>
          </div>
          
          <div className="text-center mb-12">
            <p className="text-gray-400 mb-2">has successfully completed the course</p>
            <p className="text-3xl font-bold bg-indigo-600/30 inline-block px-8 py-3 rounded-full">
              {certificateData.course}
            </p>
            <p className="text-gray-500 mt-4">
              conducted at [Guru Nanak Dev University] from [01 Jan 2024] to [31 Dec 2024].
            </p>
          </div>

          {/* Course Coverage */}
          <div className="mb-8 p-6 bg-white/5 rounded-3xl">
            <p className="text-gray-400 text-xs font-black uppercase mb-3">Course Coverage</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <span>• Computer Fundamentals</span>
              <span>• MS Word, Excel & PowerPoint</span>
              <span>• Internet & Email Management</span>
              <span>• Typing & Documentation</span>
              <span>• Practical Assignments</span>
              <span>• Final Project</span>
            </div>
          </div>

          {/* Performance */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <p className="text-gray-400 text-[10px] font-black uppercase">Attendance</p>
              <p className="text-2xl font-bold text-indigo-400">95%</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <p className="text-gray-400 text-[10px] font-black uppercase">Grade</p>
              <p className="text-2xl font-bold text-indigo-400">{certificateData.grade}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <p className="text-gray-400 text-[10px] font-black uppercase">Project</p>
              <p className="text-sm font-bold text-green-400">Completed</p>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
            <div className="flex items-center space-x-2">
              <Fingerprint size={16} className="text-indigo-400" />
              <span className="text-xs font-mono text-indigo-400">{certificateData.id}</span>
            </div>
            <span className="text-xs text-gray-500">Issued: 17 March 2024</span>
          </div>

          {/* Signatures */}
          <div className="flex justify-between mt-12">
            <div className="text-center">
              <div className="w-40 h-0.5 bg-gray-600 mb-2"></div>
              <p className="text-gray-400 text-xs">Course Instructor</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-0.5 bg-gray-600 mb-2"></div>
              <p className="text-gray-400 text-xs">Director</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={printCertificate}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors"
        >
          <Printer size={18} />
          <span className="text-sm font-bold">Print / Save PDF</span>
        </button>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl transition-colors"
        >
          <Copy size={18} />
          <span className="text-sm font-bold">Copy ID</span>
        </button>
      </div>

      <p className="text-xs text-center text-gray-500">
        Click "Print / Save PDF" then select "Save as PDF" from printer options
      </p>
    </div>
  );
};

export default CertificateCard;