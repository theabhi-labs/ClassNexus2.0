import React from 'react';
import { Phone, Mail, Facebook, Youtube, Instagram, MapPin, ExternalLink, Code2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020617] text-white overflow-hidden">
      {/* Decorative Glow Effect */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 md:pt-20 pb-8 relative z-10">

        {/* Main Grid Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 mb-12">

          {/* 1. Brand Section - Full width on mobile */}
          <div className="col-span-2 lg:col-span-1 space-y-4 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black tracking-tighter italic">
              JAS <span className="text-blue-500">COMPUTER</span>
            </h3>
            <p className="text-slate-400 leading-relaxed text-xs md:text-sm max-w-xs mx-auto md:mx-0">
              Empowering students with tech skills for over a decade. Your future starts here.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              {[
                { icon: <Facebook className="w-4 h-4" />, link: "#" },
                { icon: <Instagram className="w-4 h-4" />, link: "#" },
                { icon: <Youtube className="w-4 h-4" />, link: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className="p-2.5 bg-white/5 rounded-xl border border-white/10 hover:bg-blue-600 hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links - Side by Side on Mobile */}
          <div className="col-span-1 pl-4 md:pl-0">
            <h4 className="text-sm md:text-lg font-bold mb-5 border-l-4 border-blue-600 pl-2">Links</h4>
            <ul className="space-y-3 text-slate-400 text-xs md:text-sm">
              {['Home', 'About', 'Courses', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Reach Us - Side by Side on Mobile */}
          <div className="col-span-1">
            <h4 className="text-sm md:text-lg font-bold mb-5 border-l-4 border-blue-600 pl-2">Reach Us</h4>
            <div className="space-y-4 text-slate-400">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] md:text-sm">+91 98765 43210</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] md:text-sm break-all">info@jas.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] md:text-sm">Lucknow, UP</p>
              </div>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold mb-4 tracking-wide text-blue-400">Working Hours</h4>
            <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Mon - Sat:</span>
                <span className="text-slate-200">08:00 AM - 08:00 PM</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Sunday:</span>
                <span className="text-red-400 font-medium">Closed</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-green-500 font-bold uppercase">Institute Open Now</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] md:text-xs text-center md:text-left">
            © {currentYear} <span className="text-slate-300 font-medium">JAS Computer</span>. All rights reserved.
          </p>

          {/* Developer Portfolio Button */}
          <a
            href="https://www.rootabhi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full transition-all duration-300 active:scale-95"
          >
            <div className="relative">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
            </div>
            <span className="text-[10px] md:text-xs font-medium text-slate-300">
              Designed & Developed by <span className="text-blue-400 font-bold group-hover:underline">Abhishek Yadav</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
