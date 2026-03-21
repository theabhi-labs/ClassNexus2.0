import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { X, LayoutPanelLeft } from "lucide-react";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Page Title Logic (Handles hyphens and capitalization)
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'admin') return "Dashboard Overview";
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* ─── Desktop Sidebar (Fixed Position) ─── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 hidden lg:block
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isCollapsed ? "w-[88px]" : "w-72"}
        `}
      >
        <Sidebar collapsed={isCollapsed} />
      </aside>

      {/* ─── Mobile Sidebar (Drawer) ─── */}
      <div
        className={`
          fixed inset-y-0 left-0 z-[100] lg:hidden
          w-72 bg-white shadow-2xl
          transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center justify-between px-8 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <LayoutPanelLeft size={16} className="text-[#4F46E5]" />
            </div>
            <span className="font-black text-slate-900 tracking-tighter uppercase text-[10px]">Navigation</span>
          </div>
          <button 
            onClick={toggleMobile} 
            className="p-2 hover:bg-slate-100 rounded-xl transition-all active:scale-90"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <Sidebar collapsed={false} mobile />
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`
          fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-sm lg:hidden 
          transition-all duration-500
          ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={toggleMobile}
      />

      {/* ─── Main Content Wrapper ─── */}
      <div 
        className={`
          flex flex-1 flex-col min-w-0 min-h-screen
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isCollapsed ? "lg:pl-[88px]" : "lg:pl-72"}
        `}
      >
        {/* Header Component */}
        <Header
          onMobileMenuToggle={toggleMobile}
          onCollapseToggle={toggleCollapse}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-5 lg:p-10">
          <div className="mx-auto max-w-[1400px]">

            <div className="animate-in fade-in zoom-in-[0.98] duration-700 delay-150">
              <Outlet />
            </div>
          </div>
        </main>

        <footer className="px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/60 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-slate-400 font-black tracking-[0.15em] uppercase">
              &copy; 2026 JAS COMPUTER •  v1.0.0
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;