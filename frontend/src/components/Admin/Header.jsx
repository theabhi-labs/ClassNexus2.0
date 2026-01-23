import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

const Header = ({ onMobileMenuToggle, onCollapseToggle, isCollapsed }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 sm:px-6 justify-between">
      {/* Left - Mobile menu + Collapse toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onCollapseToggle}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Right - User, notifications, etc. */}
      <div className="flex items-center gap-4">
        {/* Add profile dropdown, notifications, theme switcher, etc. */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          A
        </div>
      </div>
    </header>
  );
};

export default Header;
