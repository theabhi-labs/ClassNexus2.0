// components/auth/SignupModal.jsx
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/authContext";

const SignupModal = () => {
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const { 
    isSignupModalOpen, 
    closeModals, 
    switchToLogin, 
    registerUser, 
    loading, 
    error 
  } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(signupData);
  };

  if (!isSignupModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        <button
          onClick={closeModals}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-black mb-2 text-gray-800">Join EduPrime</h2>
        <p className="text-gray-500 mb-6 text-sm">Start your learning journey today.</p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex gap-3 items-start text-sm animate-in slide-in-from-top duration-200">
            <AlertCircle size={20} className="mt-0.5" />
            <div>
              <p className="font-semibold">Signup Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />

          <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] shadow-lg shadow-indigo-200 transition-all">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <button onClick={switchToLogin} className="text-indigo-600 font-bold hover:underline ml-1">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;