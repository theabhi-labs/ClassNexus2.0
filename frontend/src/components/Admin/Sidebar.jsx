import { NavLink } from "react-router-dom";
import {
  Users, BookOpen, Wallet, BarChart3, Settings,
  GraduationCap, LogOut, Sparkles, LayoutGrid
} from "lucide-react";

const navItems = [
  { label: "Main Menu", items: [
      { name: "Dashboard", path: "/admin", icon: LayoutGrid },
      { name: "Students", path: "/admin/students", icon: Users },
      { name: "Courses", path: "/admin/courses", icon: BookOpen },
  ]},
  { label: "Management", items: [
      { name: "Payments", path: "/admin/payments", icon: Wallet },
      { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ]},
  { label: "Other", items: [
      { name: "Settings", path: "/admin/settings", icon: Settings },
  ]}
];

export default function Sidebar({ collapsed = false, mobile = false }) {
  return (
    <div className={`
      flex h-full flex-col bg-white
      border-r border-slate-200/60
      ${collapsed ? "w-[88px]" : mobile ? "w-full" : "w-72"}
      transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
    `}>
      
      {/* Brand Section */}
      <div className={`flex h-20 items-center ${collapsed ? "justify-center" : "px-8"}`}>
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 bg-[#4F46E5] rounded-xl shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 tracking-tighter leading-none">
                EDU<span className="text-[#4F46E5]">ADMIN</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Control Panel</span>
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
                  // Added "end" to prevent Dashboard from staying active on all sub-routes
                  end={item.path === "/admin"}
                  className={({ isActive }) => `
                    group relative flex items-center rounded-2xl transition-all duration-300
                    ${collapsed ? "justify-center h-12 w-12 mx-auto" : "gap-3 px-4 py-3"}
                    ${isActive 
                      ? "bg-indigo-50 text-[#4F46E5] shadow-sm ring-1 ring-indigo-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  {/* FIX: Use a function here to pass isActive to child elements */}
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
        <button className={`
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