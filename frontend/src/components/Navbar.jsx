import { useState, useEffect } from "react";
import { Menu, X, LogOut, User, LayoutDashboard, ChevronDown, AlertCircle } from "lucide-react";
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
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown state
  
  // States for Auth
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error message state
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const userData = res.data.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchUser();
  }, []);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setIsOpen(false);
  };

  /* ================= HANDLERS ================= */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error before login
    try {
      const res = await loginUser(loginData);
      const userData = res.data.data.user;
      const token = res.data.data.accessToken || res.data.data.token;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      setIsLoginOpen(false);
      setLoginData({ email: "", password: "" });
    } catch (err) {
      // Backend se error message handle karna
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setIsProfileOpen(false);
      navigate("/");
    } catch {
      console.error("Logout failed");
    }
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-2xl font-black text-indigo-600 flex items-center gap-2">
                <span className="bg-indigo-600 text-white p-1 rounded-lg">🎓</span>
                <span className="tracking-tight">EduPrime</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.scroll)}
                    className="text-gray-600 hover:text-indigo-600 font-semibold text-[15px] transition-all relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
              </div>

              {/* Auth Area */}
              <div className="flex items-center gap-3 border-l pl-8 border-gray-200">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-700">{user?.name.split(" ")[0]}</span>
                      <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={() => { navigate(user.role === "admin" ? "/admin" : "/students"); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition"
                        >
                          <LayoutDashboard size={18} className="text-indigo-500" /> Dashboard
                        </button>
                        <hr className="my-1 border-gray-50" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut size={18} /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button onClick={() => setIsLoginOpen(true)} className="px-5 py-2 text-gray-700 font-bold hover:text-indigo-600 transition">
                      Log in
                    </button>
                    <button
                      onClick={() => setIsSignupOpen(true)}
                      className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 transition-all active:scale-95"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= LOGIN MODAL ================= */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => {setIsLoginOpen(false); setError("");}}></div>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Welcome Back</h2>
                  <p className="text-gray-500 text-sm">Enter your credentials to access your account</p>
                </div>
                <button onClick={() => {setIsLoginOpen(false); setError("");}} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              {/* ERROR MESSAGE BOX */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 animate-shake">
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 active:scale-95'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : "Continue"}
                </button>
              </form>
              
              <p className="mt-8 text-center text-gray-500 text-sm">
                New to EduPrime? 
                <button onClick={() => {setIsLoginOpen(false); setIsSignupOpen(true);}} className="ml-1 text-indigo-600 font-bold hover:underline">Create account</button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;