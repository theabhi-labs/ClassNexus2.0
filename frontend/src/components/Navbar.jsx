import { useState } from "react";
import { Menu, X, UserCircle } from "lucide-react"; // ← added UserCircle
import { scrollToSection } from "../utils/scrollRouter";

const navItems = [
  { name: "Courses", scroll: "courses" },
  { name: "Faculty", scroll: "faculty" },
  { name: "Certificate", scroll: "certificate" },
  { name: "Contact", scroll: "contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <div className="flex-shrink-00">
            <span className="text-2xl md:text-3xl font-bold text-blue-700 tracking-tight">
              🎓 InstituteName
            </span>
          </div>

          {/* Desktop Menu + Auth / Profile */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.scroll)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 text-base"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Auth / Profile - Desktop */}
            <div className="flex items-center gap-4">
              {/* For now: always show profile icon (placeholder) */}
              <button 
                className="p-1.5 rounded-full hover:bg-gray-100 transition"
                title="Profile (coming soon)"
                // later → onClick={() => navigate("/profile")} or open dropdown
              >
                <UserCircle size={32} className="text-gray-700" />
              </button>

              {/* Comment out or remove these when auth is ready */}
              {/* <button className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium transition">
                Log in
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm">
                Sign Up
              </button> */}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 p-2 -mr-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header of drawer */}
          <div className="flex items-center justify-between p-5 border-b">
            <span className="text-xl font-bold text-blue-700">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.scroll)}
                className="block w-full text-left py-3 px-4 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Auth / Profile - Mobile */}
          <div className="p-5 border-t mt-auto space-y-4">
            {/* Profile button for mobile */}
            <button
              className="w-full py-3 px-4 flex items-center gap-3 text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              // later → onClick={() => { setIsOpen(false); navigate("/profile"); }}
            >
              <UserCircle size={24} />
              Profile (soon)
            </button>

            {/* Comment these out later when you implement real auth */}
            {/* <button
              className="w-full py-3 px-4 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </button>
            <button
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </button> */}
          </div>
        </div>
      </div>

      {/* Backdrop when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;