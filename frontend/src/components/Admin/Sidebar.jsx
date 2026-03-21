import { NavLink, useNavigate } from "react-router-dom";
import {
  Users, BookOpen, Wallet, BarChart3, Settings,
  GraduationCap, LogOut, Sparkles, LayoutGrid,
  Import
} from "lucide-react";
import toast from "react-hot-toast";
import { logoutUser } from "../../api/auth.api";

const navItems = [
  { label: "Main Menu", items: [
      { name: "Dashboard", path: "/admin", icon: LayoutGrid },
      { name: "Students", path: "/admin/students", icon: Users },
      { name: "Courses", path: "/admin/courses", icon: BookOpen },
  ]},
  { label: "Management", items: [
      { name: "Payments", path: "/admin/payments", icon: Wallet },
  ]},
];

export default function Sidebar({ collapsed = false, mobile = false }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading("Logging out...");
      
      // Call logout API
      await logoutUser();
      
      // Clear all storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Show success message
      toast.success("Logged out successfully!", {
        duration: 2000,
      });
      
      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clear local storage even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      
      toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
      
      // Redirect anyway
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className={`
      flex h-full flex-col bg-white
      border-r border-slate-200/60
      ${collapsed ? "w-[88px]" : mobile ? "w-full" : "w-72"}
      transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
    `}>
      
      {/* Brand Section */}
<div className={`flex h-16 items-center transition-all duration-500 ease-in-out ${collapsed ? "justify-center" : "px-6"}`}>
  <div className="flex items-center group cursor-pointer select-none">
    
    {!collapsed ? (
      <div className="flex flex-col leading-none relative">
        {/* Animated Background Glow */}
        <div className="absolute -inset-3 bg-gradient-to-r from-sky-500/5 via-transparent to-indigo-500/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Main Branding - Premium Layered Text */}
        <div className="flex items-baseline relative">
          {/* JAS - Premium Gradient */}
          <div className="relative">
            <span className="text-2xl font-black tracking-[-0.02em] bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent relative z-10">
              JAS
            </span>
            {/* Underline Animation */}
            <div className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-sky-500 to-indigo-500 group-hover:w-full transition-all duration-400 ease-out rounded-full" />
          </div>
          
          {/* COMPUTER - Premium Dark */}
          <div className="relative ml-2">
            <span className="text-2xl font-black tracking-[-0.02em] text-slate-950 relative z-10">
              COMPUTER
            </span>
            {/* Secondary Text Shadow */}
            <span className="absolute inset-0 text-2xl font-black tracking-[-0.02em] text-slate-950/5 blur-[0.5px]">
              COMPUTER
            </span>
          </div>
          
          {/* Premium Status Badge */}
          <div className="ml-2 relative">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/50 shadow-sm">
              <div className="relative">
                <span className="flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              </div>
              <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-wider">LIVE</span>
            </div>
            
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          </div>
        </div>

        {/* Premium Subtitle with Decorative Elements */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="h-px w-5 bg-gradient-to-r from-sky-400 via-indigo-400 to-transparent" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] hover:text-slate-700 transition-colors duration-300">
              ADMIN CONTROL
            </span>
            <div className="h-px w-5 bg-gradient-to-l from-sky-400 via-indigo-400 to-transparent" />
          </div>
        </div>
        
        {/* Decorative Dots Pattern */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-400">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-0.5 rounded-full bg-sky-400/60"></div>
            <div className="w-0.5 h-0.5 rounded-full bg-indigo-400/60"></div>
            <div className="w-0.5 h-0.5 rounded-full bg-sky-400/60"></div>
          </div>
        </div>
      </div>
    ) : (
      /* Premium Collapsed View with 3D Effect */
      <div className="relative group">
        {/* Outer Glow Ring */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400/20 via-indigo-400/20 to-sky-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
        
        {/* Main Logo Container */}
        <div className="relative flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:border-sky-200">
          {/* Inner Gradient */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          
          {/* J + C Letters with Premium Styling */}
          <div className="relative flex items-baseline">
            <span className="text-2xl font-black bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              J
            </span>
            <span className="text-xl font-black text-slate-950 -ml-0.5 mt-1">
              C
            </span>
          </div>
          
          {/* Decorative Corner Accent */}
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Hover Animation Ring */}
        <div className="absolute -inset-1 border border-sky-200 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-400 ease-out" />
        
        {/* Tooltip on Hover */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="px-1.5 py-0.5 bg-slate-800 rounded shadow-md whitespace-nowrap">
            <span className="text-[8px] font-medium text-white tracking-wide">JAS COMPUTER</span>
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-800 rotate-45"></div>
          </div>
        </div>
      </div>
    )}

  </div>
</div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {navItems.map((group, idx) => (
          <div key={idx} className="space-y-3">
            {!collapsed && (
              <p className="px-4 text-[10px] font-black uppercase tracking-[2px] text-slate-400/80">
                {group.label}
              </p>
            )}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) => `
                    group relative flex items-center rounded-2xl transition-all duration-300
                    ${collapsed ? "justify-center h-12 w-12 mx-auto" : "gap-3 px-4 py-3"}
                    ${isActive 
                      ? "bg-indigo-50 text-[#4F46E5] shadow-sm ring-1 ring-indigo-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        size={collapsed ? 22 : 19} 
                        className={`${isActive ? "text-[#4F46E5]" : "group-hover:scale-110 transition-transform"}`} 
                      />
                      
                      {!collapsed && (
                        <span className="text-sm font-bold tracking-tight">
                          {item.name}
                        </span>
                      )}
                      
                      {/* Active Marker */}
                      {isActive && !collapsed && (
                        <div className="absolute right-3 w-1.5 h-1.5 bg-[#4F46E5] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                      )}

                      {/* Tooltip for Collapsed State */}
                      {collapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className={`
          flex items-center gap-3 w-full p-2.5 rounded-2xl
          hover:bg-rose-50 group transition-all
          ${collapsed ? "justify-center" : ""}
        `}>
          <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-all`}>
            <LogOut size={18} />
          </div>
          {!collapsed && (
            <div className="text-left">
              <p className="text-sm font-bold text-slate-700 group-hover:text-rose-600">Logout</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">End Session</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}