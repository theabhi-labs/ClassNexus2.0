// components/Footer.tsx
import { Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Column 1: About Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-blue-200 leading-relaxed">
              Leading Coaching Institute providing quality education for over 10 years.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="/" className="hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="/courses" className="hover:text-white transition-colors duration-200">
                  Courses
                </a>
              </li>
              <li>
                <a href="/faculty" className="hover:text-white transition-colors duration-200">
                  Faculty
                </a>
              </li>
              {/* Add more links if needed */}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-4 text-blue-200">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+91 12345 67890</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <a 
                  href="mailto:info@institute.com" 
                  className="hover:text-white transition-colors duration-200"
                >
                  info@institute.com
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-5 mt-6">
                <a 
                  href="#" 
                  className="hover:text-blue-300 transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="hover:text-blue-300 transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a 
                  href="#" 
                  className="hover:text-blue-300 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
          <p>© {new Date().getFullYear()} InstituteName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
