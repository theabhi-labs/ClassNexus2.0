
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Wallet,
  BarChart3,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: Home },
  { name: "Students", path: "/admin/students", icon: Users },
  { name: "Courses", path: "/admin/courses", icon: BookOpen },
  { name: "Payments", path: "/admin/payments", icon: Wallet },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function Sidebar({ collapsed = false, mobile = false }) {
  return (
    <div
      className={`
        flex h-full flex-col
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        shadow-sm
        ${collapsed ? "w-16" : mobile ? "w-full" : "w-64 xl:w-72"}
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Logo / Brand */}
      <div
        className={`
          flex h-16 items-center justify-center md:justify-start
          border-b border-gray-100 dark:border-gray-800
          ${collapsed ? "px-2" : "px-5"}
        `}
      >
        {collapsed ? (
          <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
        ) : (
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              EduAdmin
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `group flex items-center rounded-xl transition-all duration-200
                ${collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon
                size={collapsed ? 24 : 20}
                className={`
                  flex-shrink-0 transition-colors duration-200
                  ${collapsed ? "group-hover:text-indigo-600 dark:group-hover:text-indigo-400" : ""}
                `}
              />

              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section - Logout / Version */}
      <div className="mt-auto border-t border-gray-100 dark:border-gray-800">
        {!collapsed ? (
          <div className="p-4 space-y-3">
            {/* Logout Button */}
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-700 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Version / Copyright */}
            <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
              v1.0 • {new Date().getFullYear()}
            </div>
          </div>
        ) : (
          <div className="py-4 flex justify-center">
            <LogOut size={20} className="text-gray-500 hover:text-red-600 transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}