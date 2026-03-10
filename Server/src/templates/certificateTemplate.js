export const certificateTemplate = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate of Completion</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Roboto', sans-serif;
      background: #f8f5f0;
      color: #0a1f44;
      width: 1123px;
      height: 794px;
      overflow: hidden;
    }

    .certificate {
      width: 1123px;
      height: 794px;
      position: relative;
      background: white;
      border: 14px solid #0a1f44;
      border-image: linear-gradient(to bottom, #0a1f44, #1e3a6d, #0a1f44) 1;
      overflow: hidden;
    }

    .inner-frame {
      border: 6px solid transparent;
      border-image: linear-gradient(to right, #b8860b, #d4af37, #b8860b) 1;
      padding: 16px;
      height: 100%;
      background: white;
    }

    .content {
      border: 1px dashed #d4af37;
      padding: 30px 50px;           /* reduced padding */
      height: 100%;
      position: relative;
      overflow: hidden;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .logo-placeholder {
      width: 100px;
      height: 100px;
      background: #f0f0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
      border: 2px solid #d4af37;
    }

    .center-header {
      text-align: center;
      flex: 1;
      margin: 0 15px;
    }

    .institute-name {
      font-family: 'Playfair Display', serif;
      font-size: 30px;
      font-weight: 700;
      color: #0a1f44;
      margin: 0;
      letter-spacing: 1px;
    }

    .tagline {
      font-size: 15px;
      color: #444;
      margin: 4px 0;
      font-style: italic;
    }

    .address {
      font-size: 12px;
      color: #555;
      margin: 6px 0;
    }

    .iso {
      font-size: 13px;
      font-weight: bold;
      color: #b8860b;
      text-align: right;
      white-space: nowrap;
    }

    .main-title {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 44px;
      color: #b8860b;
      margin: 18px 0 8px;
      letter-spacing: 1.5px;
    }

    .certify-text {
      text-align: center;
      font-size: 18px;
      color: #0a1f44;
      margin: 8px 0;
      font-style: italic;
    }

    .student-name {
      text-align: center;
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 700;
      color: #0a1f44;
      margin: 15px 0 6px;
      line-height: 1;
    }

    .enrollment-id {
      text-align: center;
      font-size: 16px;
      color: #444;
      margin-bottom: 12px;
    }

    .course-title {
      text-align: center;
      font-size: 30px;
      color: #b8860b;
      font-weight: 700;
      margin: 15px 0 8px;
      font-family: 'Playfair Display', serif;
    }

    .course-details {
      text-align: center;
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }

    .columns {
      display: flex;
      justify-content: space-between;
      gap: 30px;
      margin: 20px 0;
    }

    .column {
      flex: 1;
    }

    .column h3 {
      font-size: 18px;
      color: #0a1f44;
      margin-bottom: 8px;
      border-bottom: 1px solid #d4af37;
      padding-bottom: 4px;
    }

    .column ul {
      list-style: none;
      padding: 0;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
    }

    .column ul li {
      margin-bottom: 4px;
    }

    .seal {
      text-align: center;
      margin: 20px 0 30px;
    }

    .seal img {
      width: 120px;
      height: 120px;
    }

    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding: 0 60px;
    }

    .sig {
      text-align: center;
      width: 220px;
    }

    .sig-line {
      height: 1.5px;
      background: #0a1f44;
      margin: 20px 0 6px;
    }

    .qr {
      position: absolute;
      bottom: 45px;
      right: 50px;
    }

    .qr img {
      width: 90px;
      height: 90px;
      border: 2px solid #d4af37;
      border-radius: 6px;
    }

    .footer {
      position: absolute;
      bottom: 12px;
      left: 50px;
      right: 50px;
      text-align: center;
      font-size: 12px;
      color: #555;
      border-top: 1px solid #d4af37;
      padding-top: 8px;
    }
  </style>
</head>
<body>

<div class="certificate">
  <div class="inner-frame">
    <div class="content">

      <div class="header">
        <div class="logo-placeholder">YOUR LOGO</div>
        <div class="center-header">
          <h1 class="institute-name">${data.instituteName || 'YOUR COMPUTER TRAINING CENTER NAME'}</h1>
          <div class="tagline">(Empowering Skills for the Digital Future)</div>
          <div class="address">
            Address Line | City | State | Contact No: ${data.contact || 'XXXXXXXXXX'} | ${data.website || 'www.yourwebsite.com'}
          </div>
        </div>
        <div class="iso">ISO 9001:2015 Certified</div>
      </div>

      <h2 class="main-title">CERTIFICATE OF COMPLETION</h2>

      <div class="certify-text">This is to proudly certify that</div>

      <div class="student-name">${data.studentName}</div>

      <div class="enrollment-id">
        Enrollment No: ${data.enrollmentNo}  Certificate ID: ${data.certificateId}
      </div>

      <div class="course-title">${data.courseName}</div>

      <div class="course-details">
        conducted at ${data.centerName || '[CENTER NAME]'}<br>
        from ${data.startDate} to ${data.endDate}.
      </div>

      <div class="columns">
        <div class="column">
          <h3>→ Course Coverage:</h3>
          <ul>
            <li>Computer Fundamentals</li>
            <li>MS Word, Excel & PowerPoint</li>
            <li>Internet & Email Management</li>
            <li>Typing & Documentation</li>
            <li>Practical Assignments & Final Project</li>
          </ul>
        </div>

        <div class="column">
          <h3>← Performance Record:</h3>
          <ul>
            <li>Attendance: ${data.attendance}%</li>
            <li>Grade: ${data.grade} / Excellent</li>
            <li>Project Status: Successfully Completed</li>
          </ul>
        </div>
      </div>

      <div class="seal">
        <img src="https://via.placeholder.com/120x120/FFD700/000?text=CERTIFIED" alt="Certified Seal">
      </div>

      <div class="signatures">
        <div class="sig">
          <div class="sig-line"></div>
          Course Instructor
        </div>
        <div class="sig">
          <div class="sig-line"></div>
          Director (Authorized Signatory)
        </div>
      </div>

      <div class="qr">
        <img src="${data.qrCode}" alt="QR Code">
      </div>

      <div class="footer">
        Certificate ID: ${data.certificateId} • Issued by ${data.instituteName || 'Your Computer Training Center Name'} • Valid for professional and educational purposes.
      </div>

    </div>
  </div>
</div>

</body>
</html>
  `;
};