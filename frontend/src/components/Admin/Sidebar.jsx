import { NavLink } from "react-router-dom";
import { Home, Users, Book, BarChart, Settings,Wallet } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/admin", icon: <Home size={20} /> },
  { name: "Students", path: "/admin/students", icon: <Users size={20} /> },
  { name: "Courses", path: "/admin/courses", icon: <Book size={20} /> },
  { name: "Payments", path: "/admin/payments", icon: <Wallet size={20} /> },
  { name: "Analytics", path: "/admin/analytics", icon: <BarChart size={20} /> },
  { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 shadow-md">
      <div className="p-6 font-bold text-xl text-blue-700">
        🎓 InstituteAdmin
      </div>
      <nav className="mt-10">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors ${
                isActive ? "bg-blue-100 font-semibold text-blue-700" : ""
              }`
            }
          >
            {item.icon} {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
