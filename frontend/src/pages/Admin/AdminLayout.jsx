// src/layouts/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Optional: close mobile sidebar on route change (if using react-router v6 data router)
  // useEffect(() => {
  //   setIsMobileOpen(false);
  // }, [location.pathname]);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex h-dvh flex-col bg-gray-50 dark:bg-gray-950 lg:flex-row">
      {/* ─── Desktop Sidebar ──────────────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex lg:flex-col
          border-r border-gray-200 dark:border-gray-800
          bg-white dark:bg-gray-900
          shadow-sm
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64 xl:w-72"}
        `}
      >
        <Sidebar collapsed={isCollapsed} />
      </aside>

      {/* ─── Mobile Drawer ────────────────────────────────────────── */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 lg:hidden
          w-72 sm:w-80
          bg-white dark:bg-gray-900
          shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-end border-b border-gray-200 dark:border-gray-800 px-4">
          <button
            onClick={toggleMobile}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <Sidebar collapsed={false} mobile />
      </div>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleMobile}
          aria-hidden="true"
        />
      )}

      {/* ─── Main Area ────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header */}
        <Header
          onMobileToggle={toggleMobile}
          onCollapseToggle={toggleCollapse}
          isCollapsed={isCollapsed}
        />

        {/* Content */}
        <main
          className={`
            relative flex-1 overflow-y-auto
            bg-gray-50/70 dark:bg-gray-950/50
            transition-all duration-300
            lg:${isCollapsed ? "ml-16" : "ml-64 xl:ml-72"}
          `}
        >
          <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;