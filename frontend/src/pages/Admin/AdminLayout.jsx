// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Header from "../../components/Admin/Header";
import { Menu } from "lucide-react"; // assuming you're using lucide-react icons

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);     // mobile drawer
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // desktop collapse

  // Toggle mobile sidebar (drawer)
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Toggle desktop sidebar collapse
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-dvh bg-gray-50">
      {/* Sidebar - Desktop (always visible, collapsible) */}
      <aside
        className={`
          hidden lg:block
          ${isSidebarCollapsed ? "w-16" : "w-64"}
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200 shadow-sm
          overflow-hidden
        `}
      >
        <Sidebar collapsed={isSidebarCollapsed} />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 lg:hidden
          w-72 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar collapsed={false} /> {/* Mobile version always full */}
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - receives toggle functions */}
        <Header
          onMobileMenuToggle={toggleMobileSidebar}
          onCollapseToggle={toggleCollapse}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main Content */}
        <main
          className={`
            flex-1 p-4 sm:p-6 lg:p-8
            overflow-y-auto
            transition-all duration-300
            ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}
          `}
        >
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;