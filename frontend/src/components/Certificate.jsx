// import { useState } from "react";
// import { Download, AlertCircle, CheckCircle } from "lucide-react";
// import { certificates } from "../utils/dumy";

// const Certificate = () => {
//   const [rollNumber, setRollNumber] = useState("");
//   const [student, setStudent] = useState(null);
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     setStudent(null);

//     const found = certificates.find(
//       (s) => s.rollNumber === rollNumber.trim()
//     );

//     if (!found) {
//       setError("No certificate found for this roll number");
//       return;
//     }

//     if (found.status !== "completed") {
//       setError("Course not completed yet");
//       return;
//     }

//     setStudent(found);
//   };

//   return (
//     <section className="py-16 bg-gray-100">
//       <div className="max-w-5xl mx-auto px-5">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Certificate Download
//         </h2>

//         {/* Search Box */}
//         <form
//           onSubmit={handleSubmit}
//           className="max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4"
//         >
//           <input
//             type="text"
//             placeholder="Enter Roll Number"
//             value={rollNumber}
//             onChange={(e) => setRollNumber(e.target.value)}
//             className="w-full px-4 py-3 border rounded-lg"
//           />

//           <button className="w-full bg-green-600 text-white py-3 rounded-lg flex justify-center gap-2">
//             <Download /> Find Certificate
//           </button>

//           {error && (
//             <div className="flex gap-2 text-red-600 bg-red-50 p-3 rounded">
//               <AlertCircle /> {error}
//             </div>
//           )}
//         </form>

//         {/* CERTIFICATE PREVIEW */}
//         {student && (
//           <div className="mt-12">
//             <div className="flex justify-center gap-2 text-green-600 mb-4">
//               <CheckCircle /> Certificate Preview
//             </div>

//             {/* <CertificateTemplate data={student} /> */}

//             <div className="text-center mt-6">
//               <button
//                 onClick={() => window.print()}
//                 className="bg-blue-600 text-white px-8 py-3 rounded-lg"
//               >
//                 Download / Print
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Certificate;


import React from 'react'

export default function Certificate() {
  return (
    <div>Certificate</div>
  )
}
