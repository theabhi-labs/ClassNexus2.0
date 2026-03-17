import { QRCodeSVG } from "qrcode-react";

const CertificateTemplate = ({ data }) => {
  const verifyUrl = `https://institutename.com/certificate/verify?roll=${data.rollNumber}`;

  return (
    <div className="relative w-full bg-white border-[6px] border-yellow-500 p-10 rounded-xl">

      {/* QR CODE */}
      <div className="absolute right-10 top-10 text-center">
        <QRCodeSVG
          value={verifyUrl}
          size={90}
          bgColor="#ffffff"
          fgColor="#000000"
        />
        <p className="text-xs mt-2 text-gray-500">Verify Certificate</p>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          CERTIFICATE OF COMPLETION
        </h1>
        <p className="text-gray-500 mt-2">Institute of Technology</p>
      </div>

      {/* Body */}
      <div className="text-center mt-12">
        <p className="text-lg text-gray-700">This is to certify that</p>
        <h2 className="text-4xl font-extrabold text-blue-700 mt-4">{data.name}</h2>
        <p className="text-lg text-gray-700 mt-6">has successfully completed the course</p>
        <h3 className="text-2xl font-semibold mt-3 text-gray-900">{data.course}</h3>
        <p className="mt-6 text-gray-600">Roll Number: <strong>{data.rollNumber}</strong></p>
        <p className="mt-2 text-gray-600">Issued on: <strong>{data.issueDate}</strong></p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-16">
        <div>
          <p className="font-semibold">Director</p>
          <div className="w-40 h-[2px] bg-gray-400 mt-2" />
        </div>
        <div>
          <p className="font-semibold">Authorized Signature</p>
          <div className="w-40 h-[2px] bg-gray-400 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
