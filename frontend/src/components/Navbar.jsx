import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, AlertCircle, User } from "lucide-react";
import { scrollToSection } from "../utils/scrollRouter";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../api/auth.api.js";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "Courses", scroll: "courses" },
  { name: "Faculty", scroll: "faculty" },
  { name: "Certificate", scroll: "certificate" },
  { name: "Contact", scroll: "contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await getCurrentUser();
        setUser(res.data?.data?.user || res.data?.user);
      } catch (err) {
        console.error("Auth Check Failed:", err);
        setUser(null);
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  const handleNavClick = (section) => {
    // Special handling for certificate section
    if (section === "certificate") {
      navigate("/certificate");
    } else {
      scrollToSection(section);
    }
    setIsOpen(false);
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const res = await loginUser(loginData);

    const userData = res.data?.data?.user || res.data?.user;
    const token = res.data?.data?.accessToken || res.data?.accessToken;

    if (token) localStorage.setItem("token", token);
    
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoginOpen(false);
    if (userData?.role !== "admin") {
      navigate(`/profile/${userData._id}`);
    } else {
      navigate("/admin");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Invalid Credentials");
  } finally {
    setLoading(false);
  }
};

const handleSignupSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const res = await registerUser(signupData);
    const user = res?.data?.data?.user || res?.data?.user;
    const token = res?.data?.data?.accessToken || res?.data?.accessToken;

    if (token) {
      localStorage.setItem("token", token);
    }

    setUser(user);
    setIsSignupOpen(false);

  } catch (err) {
    let message = "Signup Failed";

    if (err.response?.status === 409) {
      message = "Email already registered. Please login.";
    }
    else if (typeof err.response?.data === "object") {
      message =
        err.response.data.message ||
        err.response.data.error ||
        message;
    }
    else if (typeof err.response?.data === "string") {

      const match = err.response.data.match(/Error:\s*(.*?)</);

      if (match && match[1]) {
        message = match[1];
      }
    }
    setError(message);
  } finally {
    setLoading(false);
  }
};

  const handleProfileClick = () => {
    if (!user) return;

    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate(`/profile/${user?._id}`);
    }
    setIsOpen(false); // Close mobile menu after click
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    setUser(null);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
<nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-[60] border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16 md:h-24"> {/* Height slightly increased for better label breathing */}
      
      {/* --- LOGO & INSTITUTE NAME --- */}
      <div
        className="flex-shrink-0 cursor-pointer group flex items-center gap-2 sm:gap-4"
        onClick={() => navigate("/")}
      >
        {/* Logo Container */}
        <div className="relative flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 group">
          {/* Dynamic Purple Glow */}
          <div className="absolute inset-0 bg-purple-600/20 blur-[20px] rounded-full animate-pulse group-hover:bg-purple-500/40 transition-all duration-700" />

          {/* Glassmorphism Background */}
          <div className="absolute inset-1 sm:inset-2 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500" />

          <svg
            viewBox="0 0 100 100"
            className="relative w-10 h-10 sm:w-16 sm:h-16 drop-shadow-2xl transform transition-all duration-500 group-hover:rotate-[-5deg]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="M10 40L50 20L90 40L50 60L10 40Z" className="fill-slate-900 group-hover:fill-indigo-950 transition-colors" />
              <path d="M25 48V62C25 62 35 70 50 70C65 70 75 62 75 62V48" className="fill-slate-800" />
              <path d="M90 40V65" className="stroke-amber-400" strokeWidth="3" strokeLinecap="round" />
              <circle cx="90" cy="68" r="4" className="fill-amber-500 animate-bounce group-hover:animate-none" />
            </g>
          </svg>
        </div>

        {/* Typography Section - Managing the long name */}
        <div className="flex flex-col justify-center overflow-hidden">
          <h1 className="text-[14px] xs:text-[16px] md:text-2xl font-black tracking-tighter leading-[1.1] text-slate-800 uppercase">
            JAS COMPUTER <span className="text-indigo-600 block sm:inline">INSTITUTE</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1.5px] w-2 sm:w-4 bg-indigo-500 rounded-full"></span>
            <p className="text-[7px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.3em] text-slate-400 whitespace-nowrap">
              & Training Center
            </p>
          </div>
        </div>
      </div>

      {/* --- DESKTOP MENU --- */}
      <div className="hidden md:flex items-center gap-8">
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <button key={item.name} onClick={() => handleNavClick(item.scroll)} className="text-gray-600 hover:text-indigo-600 font-bold transition-colors text-sm uppercase tracking-wider">{item.name}</button>
          ))}
        </div>

        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
  {isLoggedIn ? (
    <button
      onClick={handleProfileClick}
      className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition"
    >

      {user?.profilePhoto ? (
        <img
          src={user.profilePhoto}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}

      <span className="font-bold text-gray-700 text-sm">
        {user?.name?.split(" ")[0]}
      </span>

    </button>
  ) : (
    <div className="flex items-center gap-4">
      <button
        onClick={() => { setIsLoginOpen(true); setError("") }}
        className="font-bold text-gray-600 hover:text-indigo-600 text-sm"
      >
        LOGIN
      </button>

      <button
        onClick={() => { setIsSignupOpen(true); setError("") }}
        className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
      >
        SIGN UP
      </button>
    </div>
  )}
</div>
      </div>

      {/* --- MOBILE HAMBURGER --- */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all">
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </div>
  </div>

  {/* --- MOBILE MENU --- */}
  {isOpen && (
    <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-2xl z-[70] animate-in slide-in-from-top duration-300">
      <div className="px-6 py-8 space-y-5">
        {navItems.map((item) => (
          <button key={item.name} onClick={() => handleNavClick(item.scroll)} className="block w-full text-left text-lg font-black text-slate-700 uppercase tracking-tight">{item.name}</button>
        ))}

        <div className="pt-6 border-t border-slate-100 space-y-4">
          {isLoggedIn ? (
            <>
              {/* FIXED: Mobile profile button - now properly clickable */}
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-3 w-full p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-black text-slate-800">{user?.name}</span>
              </button>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 w-full p-3 font-black text-rose-500 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors"
              >
                <LogOut size={20} /> LOG OUT
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setIsLoginOpen(true); setIsOpen(false); }} className="py-4 border-2 border-slate-100 font-black rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors">LOGIN</button>
              <button onClick={() => { setIsSignupOpen(true); setIsOpen(false); }} className="py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">JOIN NOW</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</nav>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">

          <div className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Close Button */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-black mb-2 text-gray-800">
              Welcome Back
            </h2>

            <p className="text-gray-500 mb-6 text-sm">
              Please enter your details to sign in.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex gap-2 items-center text-sm font-medium animate-in slide-in-from-top duration-200">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />

              {/* Login Button */}
              <button
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] shadow-lg shadow-indigo-200 transition-all"
              >
                {loading ? "Loading..." : "Log in"}
              </button>

            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?
              <button
                onClick={() => {
                  setIsLoginOpen(false);
                  setIsSignupOpen(true);
                }}
                className="text-indigo-600 font-bold hover:underline ml-1"
              >
                Sign Up
              </button>
            </p>

          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {isSignupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">

          <div className="relative w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Close Button */}
            <button
              onClick={() => setIsSignupOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-black mb-2 text-gray-800">
              Join EduPrime
            </h2>

            <p className="text-gray-500 mb-6 text-sm">
              Start your learning journey today.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex gap-3 items-start text-sm animate-in slide-in-from-top duration-200">
                <AlertCircle size={20} className="mt-0.5" />
                <div>
                  <p className="font-semibold">Signup Error</p>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignupSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />

              {/* Submit Button */}
              <button
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:scale-[1.02] shadow-lg shadow-indigo-200 transition-all"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?
              <button
                onClick={() => {
                  setIsSignupOpen(false);
                  setIsLoginOpen(true);
                }}
                className="text-indigo-600 font-bold hover:underline ml-1"
              >
                Log in
              </button>
            </p>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;