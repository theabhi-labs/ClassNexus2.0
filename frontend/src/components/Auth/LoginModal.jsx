// components/auth/LoginModal.jsx
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/authContext";

const LoginModal = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { 
    isLoginModalOpen, 
    closeModals, 
    switchToSignup, 
    loginUser, 
    loading, 
    error 
  } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser(loginData);
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        <button
          onClick={closeModals}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-black mb-2 text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 mb-6 text-sm">Please enter your details to sign in.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex gap-2 items-center text-sm font-medium animate-in slide-in-from-top duration-200">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />

          <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] shadow-lg shadow-indigo-200 transition-all">
            {loading ? "Loading..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?
          <button onClick={switchToSignup} className="text-indigo-600 font-bold hover:underline ml-1">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;