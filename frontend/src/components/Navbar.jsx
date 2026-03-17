// components/Navbar.jsx
import React, { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { scrollToSection } from "../utils/scrollRouter";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Auth/LoginModal";
import SignupModal from "./Auth/SignupModal";

const navItems = [
  { name: "Courses", scroll: "courses" },
  { name: "Faculty", scroll: "faculty" },
  { name: "Certificate", scroll: "certificate" },
  { name: "Contact", scroll: "contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    user, 
    isAuthenticated, 
    logoutUser,
    openLoginModal,
    openSignupModal
  } = useAuth();
  
  const navigate = useNavigate();

  const handleNavClick = (section) => {
    if (section === "certificate") {
      navigate("/certificate");
    } else {
      scrollToSection(section);
    }
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    if (!user) return;
    
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate(`/profile/${user._id}`);
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-[60] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-24">
            
            {/* Logo Section */}
            <div
              className="flex-shrink-0 cursor-pointer group flex items-center gap-2 sm:gap-4"
              onClick={() => navigate("/")}
            >
              <div className="relative flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 group">
                <div className="absolute inset-0 bg-purple-600/20 blur-[20px] rounded-full animate-pulse group-hover:bg-purple-500/40 transition-all duration-700" />
                <div className="absolute inset-1 sm:inset-2 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl group-hover:scale-110 transition-transform duration-500" />
                <svg
                  viewBox="0 0 100 100"
                  className="relative w-10 h-10 sm:w-16 sm:h-16 drop-shadow-2xl transform transition-all duration-500 group-hover:rotate-[-5deg]"
                >
                  <g>
                    <path d="M10 40L50 20L90 40L50 60L10 40Z" className="fill-slate-900 group-hover:fill-indigo-950 transition-colors" />
                    <path d="M25 48V62C25 62 35 70 50 70C65 70 75 62 75 62V48" className="fill-slate-800" />
                    <path d="M90 40V65" className="stroke-amber-400" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="90" cy="68" r="4" className="fill-amber-500 animate-bounce group-hover:animate-none" />
                  </g>
                </svg>
              </div>
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

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navItems.map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => handleNavClick(item.scroll)} 
                    className="text-gray-600 hover:text-indigo-600 font-bold transition-colors text-sm uppercase tracking-wider"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                {isAuthenticated ? (
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
                      onClick={openLoginModal}
                      className="font-bold text-gray-600 hover:text-indigo-600 text-sm"
                    >
                      LOGIN
                    </button>
                    <button
                      onClick={openSignupModal}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-black text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                    >
                      SIGN UP
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-2xl z-[70] animate-in slide-in-from-top duration-300">
            <div className="px-6 py-8 space-y-5">
              {navItems.map((item) => (
                <button 
                  key={item.name} 
                  onClick={() => handleNavClick(item.scroll)} 
                  className="block w-full text-left text-lg font-black text-slate-700 uppercase tracking-tight"
                >
                  {item.name}
                </button>
              ))}

              <div className="pt-6 border-t border-slate-100 space-y-4">
                {isAuthenticated ? (
                  <>
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
                    <button 
                      onClick={() => { 
                        openLoginModal(); 
                        setIsOpen(false); 
                      }} 
                      className="py-4 border-2 border-slate-100 font-black rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      LOGIN
                    </button>
                    <button 
                      onClick={() => { 
                        openSignupModal(); 
                        setIsOpen(false); 
                      }} 
                      className="py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
                    >
                      JOIN NOW
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal />
      <SignupModal />
    </>
  );
};

export default Navbar;