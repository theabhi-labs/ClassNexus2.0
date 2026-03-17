// components/CertificatePDF.jsx
import React from 'react';
import { Page, Document, PDFViewer, PDFDownloadLink, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register a font (optional)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica-neue/v30/1Ptsg8zYS_SKggPNyCg4TYFv.ttf' }
  ]
});

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  certificate: {
    borderWidth: 15,
    borderColor: '#1e3a8a',
    padding: 30,
    minHeight: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 15
  },
  logoSection: {
    alignItems: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    marginBottom: 5
  },
  logoText: {
    fontSize: 20,
    color: '#1e3a8a',
    fontWeight: 'bold'
  },
  certifiedBadge: {
    fontSize: 8,
    color: '#1e3a8a',
    borderWidth: 1,
    borderColor: '#1e3a8a',
    padding: '3 8',
    borderRadius: 4,
    marginTop: 5
  },
  centerInfo: {
    alignItems: 'flex-end'
  },
  centerName: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: 'bold'
  },
  centerTagline: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5
  },
  centerAddress: {
    fontSize: 8,
    color: '#888',
    marginTop: 5
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 30
  },
  title: {
    fontSize: 28,
    color: '#1e3a8a',
    fontWeight: 'bold',
    borderBottomWidth: 3,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 10
  },
  studentSection: {
    alignItems: 'center',
    marginVertical: 30
  },
  studentName: {
    fontSize: 36,
    color: '#1e3a8a',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 5
  },
  enrollmentNo: {
    fontSize: 12,
    color: '#666',
    marginTop: 10
  },
  completionText: {
    alignItems: 'center',
    marginVertical: 20
  },
  completionPara: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  courseName: {
    fontSize: 22,
    color: '#ffffff',
    backgroundColor: '#1e3a8a',
    padding: '10 30',
    borderRadius: 5,
    marginVertical: 10
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  coverageSection: {
    marginVertical: 20
  },
  sectionTitle: {
    fontSize: 14,
    color: '#1e3a8a',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    marginBottom: 10
  },
  coverageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  coverageItem: {
    width: '50%',
    fontSize: 11,
    color: '#444',
    marginBottom: 5
  },
  performanceSection: {
    marginVertical: 20
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    paddingHorizontal: 10
  },
  performanceItem: {
    fontSize: 12
  },
  performanceLabel: {
    fontWeight: 'bold',
    color: '#1e3a8a'
  },
  performanceValue: {
    color: '#333'
  },
  certificateId: {
    textAlign: 'right',
    fontSize: 10,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 20
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50
  },
  signature: {
    width: 200,
    alignItems: 'center'
  },
  signatureLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#333',
    marginBottom: 5
  },
  signatureTitle: {
    fontSize: 11,
    color: '#333'
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    fontSize: 8,
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10
  }
});

// Main PDF Document Component
const CertificatePDF = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.certificate}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>GNDU</Text>
            </View>
            <Text style={styles.certifiedBadge}>ISO 9001:2015 Certified</Text>
          </View>
          
          <View style={styles.centerInfo}>
            <Text style={styles.centerName}>Guru Nanak Dev University</Text>
            <Text style={styles.centerTagline}>(Empowering Skills for the Digital Future)</Text>
            <Text style={styles.centerAddress}>Amritsar, Punjab | Contact: +91 1234567890 | www.gndu.ac.in</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>CERTIFICATE OF COMPLETION</Text>
          <Text style={styles.subtitle}>This is to proudly certify that</Text>
        </View>

        {/* Student Name */}
        <View style={styles.studentSection}>
          <Text style={styles.studentName}>{data.studentName}</Text>
          <Text style={styles.enrollmentNo}>Enrollment No: [{data.studentId}]</Text>
        </View>

        {/* Completion Text */}
        <View style={styles.completionText}>
          <Text style={styles.completionPara}>has successfully completed the course</Text>
          <Text style={styles.courseName}>{data.course}</Text>
          <Text style={styles.duration}>
            conducted at [Guru Nanak Dev University] from [01 Jan 2024] to [31 Dec 2024].
          </Text>
        </View>

        {/* Course Coverage */}
        <View style={styles.coverageSection}>
          <Text style={styles.sectionTitle}>Course Coverage:</Text>
          <View style={styles.coverageGrid}>
            <Text style={styles.coverageItem}>• Computer Fundamentals</Text>
            <Text style={styles.coverageItem}>• MS Word, Excel & PowerPoint</Text>
            <Text style={styles.coverageItem}>• Internet & Email Management</Text>
            <Text style={styles.coverageItem}>• Typing & Documentation</Text>
            <Text style={styles.coverageItem}>• Practical Assignments</Text>
            <Text style={styles.coverageItem}>• Final Project</Text>
          </View>
        </View>

        {/* Performance Record */}
        <View style={styles.performanceSection}>
          <Text style={styles.sectionTitle}>Performance Record:</Text>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Attendance:</Text>
            <Text style={styles.performanceValue}>95%</Text>
          </View>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Grade:</Text>
            <Text style={styles.performanceValue}>{data.grade}</Text>
          </View>
          <View style={styles.performanceRow}>
            <Text style={styles.performanceLabel}>Project Status:</Text>
            <Text style={styles.performanceValue}>Successfully Completed</Text>
          </View>
        </View>

        {/* Certificate ID */}
        <Text style={styles.certificateId}>Certificate ID: {data.id}</Text>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureTitle}>Course Instructor</Text>
          </View>
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureTitle}>Director (Authorized Signatory)</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This certificate is digitally generated and does not require a physical signature
        </Text>
      </View>
    </Page>
  </Document>
);

export default CertificatePDF;