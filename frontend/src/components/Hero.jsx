import { useState, useEffect } from "react";
import { Play, ArrowRight, Users, GraduationCap, FileText, Star } from "lucide-react";

const slides = [
  { url: "https://c8.alamy.com/comp/KX392G/indian-group-college-students-laptop-study-in-classroom-education-KX392G.jpg" },
  { url: "https://c8.alamy.com/comp/KX3873/group-indian-school-students-book-with-laptop-study-e-learning-class-KX3873.jpg" },
  { url: "https://c8.alamy.com/comp/JC2CA3/indian-college-friends-student-studying-laptop-library-JC2CA3.jpg" },
  { url: "https://www.shutterstock.com/image-photo/indian-young-adult-gen-z-260nw-2676889223.jpg" },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-slate-900">
      {/* ================= HERO SLIDER ================= */}
      <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
            {/* Multi-layer Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          </div>
        ))}

        <div className="relative z-10 flex h-full items-center max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 backdrop-blur-md px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold tracking-wide uppercase">Leading Institute in India</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Future</span> With Us
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Unlock your potential with industry-aligned courses, expert mentorship, 
              and a community dedicated to your professional growth.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button className="group w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2">
                Get Started 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-white" /> Watch Video
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-16 right-6 lg:right-12 flex flex-col gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-12 w-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? "bg-blue-500 h-16" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= FLOATING STATS ================= */}
      <section className="relative z-30 -mt-12 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard 
              icon={<GraduationCap className="text-blue-500" />} 
              number="10+" 
              title="Years Experience" 
              desc="Trusted since 2015" 
            />
            <StatCard 
              icon={<Users className="text-indigo-500" />} 
              number="50+" 
              title="Expert Faculty" 
              desc="IIT & NIT alumni" 
            />
            <StatCard 
              icon={<FileText className="text-purple-500" />} 
              number="1000+" 
              title="Study Notes" 
              desc="High-quality content" 
            />
            <StatCard 
              icon={<Star className="text-orange-500" />} 
              number="95%" 
              title="Success Rate" 
              desc="Consistent results" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, number, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center group hover:border-blue-200 transition-all duration-300">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-4xl font-black text-slate-900 mb-1">{number}</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
