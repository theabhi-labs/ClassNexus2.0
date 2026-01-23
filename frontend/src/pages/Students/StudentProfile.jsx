import { IndianRupee, Download, User, BookOpen, CreditCard, Award, LogOut } from "lucide-react";

const StudentProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Institute Name */}
            <div className="flex items-center gap-3">
              {/* You can replace with your real logo SVG / PNG */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                <BookOpen className="w-6 h-6 text-indigo-700" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                TechVision Institute
              </span>
            </div>

            {/* Right side - can add more links later */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                <User size={18} />
                Profile
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center md:text-left">
          Student Profile
        </h1>

        <div className="space-y-6 md:space-y-8">
          {/* ================= BASIC INFO CARD ================= */}
{/* ================= RESPONSIVE BASIC INFO – MOBILE CARD | DESKTOP FULL WIDTH ================= */}
<div className="w-full">
  {/* Mobile → Card Layout | Desktop → Full Width Modern Layout */}
  <div className="block md:hidden">
    {/* MOBILE ONLY: Compact Card (exact wahi jo tumhe pasand aaya) */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl max-w-md mx-auto">
      <div className="bg-gradient-to-b from-indigo-50 to-white pt-8 pb-6 px-5 text-center">
        <div className="relative inline-block">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Rahul Sharma"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
          />
          <span className="absolute bottom-2 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <h2 className="mt-5 text-2xl font-bold text-gray-800">Rahul Sharma</h2>
      </div>

      <div className="px-6 pb-7 pt-4 space-y-4 text-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-600 font-semibold text-sm">ID</span>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Roll Number</p>
            <p className="font-medium">AKTU2024-001</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Email</p>
            <p className="font-medium break-all">rahul.sharma@example.com</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Mobile</p>
            <p className="font-medium">+91 9876543210</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 text-center border-t">
        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          Edit Profile →
        </button>
      </div>
    </div>
  </div>

  {/* DESKTOP ONLY: Full Width Modern Profile */}
  <div className="hidden md:block">
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
        {/* Optional pattern or overlay */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>

      <div className="relative px-8 pt-8 pb-10 -mt-16">
        <div className="flex items-end gap-8">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Rahul Sharma"
              className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <span className="absolute bottom-3 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></span>
          </div>

          <div className="flex-1 pb-4">
            <h2 className="text-3xl font-bold text-gray-800">Rahul Sharma</h2>
            <p className="text-gray-600 mt-1">Full Stack Web Developer Student</p>
          </div>

          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-10 text-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">ID</span>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Roll Number</p>
              <p className="font-semibold text-lg">AKTU2024-001</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Email</p>
              <p className="font-semibold text-lg">rahul.sharma@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Mobile</p>
              <p className="font-semibold text-lg">+91 9876543210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

          {/* ================= COURSE INFO ================= */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-5">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Course Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="font-semibold text-gray-600">Course</p>
                <p className="text-gray-900">Full Stack Web Development</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Duration</p>
                <p className="text-gray-900">6 Months</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Join Date</p>
                <p className="text-gray-900">01 Feb 2025</p>
              </div>
              <div>
                <p className="font-semibold text-gray-600">Status</p>
                <span className="text-green-600 font-medium">In Progress</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3.5 rounded-full transition-all duration-1000"
                  style={{ width: "85%" }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Progress</span>
                <span className="font-bold text-indigo-700">85% Complete</span>
              </div>
            </div>
          </div>

          {/* ================= PAYMENT INFO ================= */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 transition-all hover:shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Payment Information</h3>
                </div>

                <div className="space-y-3 text-gray-700">
                  <p className="flex items-center gap-2">
                    <IndianRupee size={18} className="text-green-600" />
                    <span className="font-semibold">Total Fee:</span> ₹60,000
                  </p>
                  <p className="flex items-center gap-2">
                    <IndianRupee size={18} className="text-blue-600" />
                    <span className="font-semibold">Paid:</span> ₹50,000
                  </p>
                  <p className="flex items-center gap-2 text-red-600 font-medium">
                    <IndianRupee size={18} />
                    <span className="font-semibold">Pending:</span> ₹10,000
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5 w-full sm:w-72 text-center">
                <p className="font-bold text-red-700 text-lg">Current Month: Pending</p>
                <p className="mt-3 text-sm bg-white text-gray-700 rounded-lg px-3 py-1.5 inline-block border border-gray-200">
                  Payment Type: Per Month
                </p>
              </div>
            </div>
          </div>

          {/* ================= CERTIFICATES ================= */}
          <div className="bg-white rounded-2xl shadow-md p-5 sm:p-7 transition-all hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">Certificates</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Certificate 1 */}
              <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
                <h4 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors">
                  Full Stack Web Development
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Issued on: 10 Aug 2025
                </p>
                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all">
                  <Download size={18} />
                  Download
                </button>
              </div>

              {/* Certificate 2 */}
              <div className="border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
                <h4 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors">
                  Python Programming
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Issued on: 15 Aug 2025
                </p>
                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all">
                  <Download size={18} />
                  Download
                </button>
              </div>

              {/* You can add more certificate cards here */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;