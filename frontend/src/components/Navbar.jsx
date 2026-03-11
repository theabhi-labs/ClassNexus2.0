import { useState, useEffect } from "react";
import { Menu, X, LogOut, AlertCircle, User } from "lucide-react";
import { scrollToSection } from "../utils/scrollRouter";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../api/auth.api.js";
import { getUserProfile } from "../api/student.api.js";
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
      try {
        const res = await getCurrentUser();
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setIsOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(loginData);
      setUser(res.data.data.user);
      localStorage.setItem("token", res.data.data.accessToken);
      setIsLoginOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally { setLoading(false); }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerUser(signupData);
      setUser(res.data.data.user);
      localStorage.setItem("token", res.data.data.accessToken);
      setIsSignupOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Signup Failed");
    } finally { setLoading(false); }
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
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer group flex items-center gap-4"
              onClick={() => navigate("/")}
            >
              {/* Larger Logo Container */}
          <div className="relative flex items-center justify-center w-20 h-20 group cursor-pointer">
  {/* Dynamic Purple Glow (Chamak) */}
  <div className="absolute inset-0 bg-purple-600/30 blur-[25px] rounded-full animate-pulse group-hover:bg-purple-500/50 transition-all duration-700" />
  
  {/* Glassmorphism Background for Cap */}
  <div className="absolute inset-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500" />

  <svg 
    viewBox="0 0 100 100" 
    className="relative w-16 h-16 drop-shadow-2xl transform transition-all duration-500 group-hover:rotate-[-5deg] group-hover:scale-110"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Large Graduation Cap Design */}
    <g>
      {/* Top Diamond - Bada aur Bold */}
      <path 
        d="M10 40L50 20L90 40L50 60L10 40Z" 
        className="fill-slate-900 group-hover:fill-indigo-950 transition-colors duration-300"
      />
      
      {/* Cap Base (Niche ka hissa) */}
      <path 
        d="M25 48V62C25 62 35 70 50 70C65 70 75 62 75 62V48" 
        className="fill-slate-800"
      />

      {/* Tassel (Sunehri Latkan) */}
      <path 
        d="M90 40V65" 
        className="stroke-amber-400" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      <circle cx="90" cy="68" r="4" className="fill-amber-500 animate-bounce group-hover:animate-none" />
      
      {/* Subtle Shine on Cap */}
      <path 
        d="M25 38L50 25L80 38" 
        stroke="white" 
        strokeWidth="0.5" 
        fill="none" 
        className="opacity-30"
      />
    </g>
  </svg>
</div>

              {/* Typography Side */}
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-none text-slate-800">
                  JAS <span className="text-indigo-600">Computer</span>
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1">
                  Learning Hub
                </p>
              </div>
            </div>

            {/* Desktop Menu - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navItems.map((item) => (
                  <button key={item.name} onClick={() => handleNavClick(item.scroll)} className="text-gray-600 hover:text-indigo-600 font-bold transition-colors">{item.name}</button>
                ))}
              </div>

              <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/profile/${user?._id}`)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>

                      <span className="font-bold text-gray-700">
                        {user?.name?.split(" ")[0]}
                      </span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button onClick={() => { setIsLoginOpen(true); setError("") }} className="font-bold text-gray-700 hover:text-indigo-600">Log in</button>
                    <button onClick={() => { setIsSignupOpen(true); setError("") }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all">Sign Up</button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Icon - Clean View */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                {isOpen ? <X size={30} /> : <Menu size={30} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN - Logic for LoggedIn and Guest */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-2xl z-[70] animate-in slide-in-from-top duration-300">
            <div className="px-6 py-8 space-y-6">
              {navItems.map((item) => (
                <button key={item.name} onClick={() => handleNavClick(item.scroll)} className="block w-full text-left text-xl font-bold text-gray-700 active:text-indigo-600">{item.name}</button>
              ))}

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => navigate(`/profile/${user?._id}`)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>

                      <span className="font-bold text-gray-700">
                        {user?.name.split(" ")[0]}
                      </span>
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-4 font-bold text-red-600 text-lg">
                      <LogOut size={24} /> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setIsLoginOpen(true); setIsOpen(false); setError("") }}
                      className="w-full py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-2xl text-lg hover:bg-indigo-50"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => { setIsSignupOpen(true); setIsOpen(false); setError("") }}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl text-lg shadow-lg active:scale-95 transition-all"
                    >
                      Get Started Free
                    </button>
                  </>
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
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex gap-2 items-center text-sm font-medium animate-in slide-in-from-top duration-200">
                <AlertCircle size={18} />
                {error}
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