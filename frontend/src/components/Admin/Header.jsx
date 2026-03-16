import { Menu, ChevronLeft, ChevronRight, Bell, Search, Command, Settings, Sparkles } from "lucide-react";

const Header = ({ onMobileMenuToggle, onCollapseToggle, isCollapsed }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
        
        {/* Left Section: Controls & Search */}
        <div className="flex items-center gap-5 flex-1">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>

          {/* Sidebar Toggle - Using Primary Theme Color on Hover */}
          <button
            onClick={onCollapseToggle}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-[#4F46E5] hover:border-[#4F46E5]/30 hover:shadow-indigo-50 transition-all duration-200 group"
          >
            {isCollapsed ? 
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" /> : 
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            }
          </button>

          {/* Command Search Bar - Ultra Clean Slate Theme */}
          <div className="hidden md:flex items-center flex-1 max-w-md relative group">
            <Search className="absolute left-4 text-slate-400 group-focus-within:text-[#4F46E5] transition-colors" size={17} />
            <input 
              type="text" 
              placeholder="Quick search... (Alt+S)" 
              className="w-full bg-slate-50 border-slate-200/60 border focus:bg-white focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/5 py-2.5 pl-11 pr-12 rounded-2xl text-sm font-medium transition-all outline-none placeholder:text-slate-400"
            />
            <div className="absolute right-3 hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 bg-white text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              <Command size={10} /> K
            </div>
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Action Buttons */}
          <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
             <button className="relative p-2 rounded-xl text-slate-500 hover:bg-white hover:text-[#4F46E5] hover:shadow-sm transition-all group">
                <Bell size={19} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
             </button>
             <button className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-[#4F46E5] hover:shadow-sm transition-all">
                <Settings size={19} />
             </button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

          {/* User Profile - Premium Identity */}
          <button className="flex items-center gap-3 pl-1 pr-1 sm:pr-3 py-1 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100 group-hover:rotate-3 transition-transform">
                A
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="hidden md:block text-left">
              <p className="text-sm font-black text-slate-900 leading-tight tracking-tight">Arjun Singh</p>
              <div className="flex items-center gap-1">
                 <Sparkles size={10} className="text-[#4F46E5]" />
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
