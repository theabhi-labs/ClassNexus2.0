import { useState, useEffect } from "react";
import { Play, ArrowRight, Users, GraduationCap, FileText, Star, ShieldCheck } from "lucide-react";

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
    <div className="relative bg-slate-950 overflow-x-hidden font-sans">
      {/* ================= HERO SLIDER ================= */}
      <section className="relative h-[95vh] min-h-[700px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url(${slide.url})` }}
            />
            {/* Professional Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
          </div>
        ))}

        <div className="relative z-10 flex h-full items-center max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full max-w-3xl text-white">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-8 animate-fade-in shadow-2xl">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-blue-500 flex items-center justify-center text-[8px]">★</div>)}
              </div>
              <span className="text-xs md:text-sm font-medium tracking-wide text-blue-200">
                Trusted by 50,000+ Students
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8 italic-none">
              Build Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-indigo-300 to-white">
                Digital Legacy
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-300/90 mb-10 max-w-xl leading-relaxed font-normal text-center md:text-left">
              Unlock your <span className="text-white font-semibold">potential</span> with industry-aligned courses, expert mentorship, and a community dedicated to your <span className="text-blue-400">professional growth.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <button className="group w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-full shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-3">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold text-lg rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <div className="p-1 bg-white/10 rounded-full"><Play className="w-4 h-4 fill-white" /></div>
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Improved Vertical Progress Indicators */}
        <div className="absolute bottom-1/2 translate-y-1/2 right-6 lg:right-12 flex flex-col gap-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative flex items-center justify-end"
            >
              <span className={`mr-4 text-xs font-bold transition-opacity duration-300 ${index === currentSlide ? "opacity-100" : "opacity-0 text-slate-500"}`}>0{index + 1}</span>
              <div className={`h-8 w-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? "bg-blue-500 h-12 shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "bg-white/20 group-hover:bg-white/40"
              }`} />
            </button>
          ))}
        </div>
      </section>

      {/* ================= FLOATING STATS ================= */}
      <section className="relative z-30 -mt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <StatCard 
              icon={<GraduationCap className="w-6 h-6 text-blue-400" />} 
              number="10+" 
              title="Years Exp." 
              desc="Trusted Excellence" 
            />
            <StatCard 
              icon={<Users className="w-6 h-6 text-indigo-400" />} 
              number="50+" 
              title="Experts" 
              desc="Industry Leaders" 
            />
            <StatCard 
              icon={<FileText className="w-6 h-6 text-purple-400" />} 
              number="1k+" 
              title="Notes" 
              desc="Premium Content" 
            />
            <StatCard 
              icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />} 
              number="95%" 
              title="Success" 
              desc="Proven Results" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, number, title, desc }) {
  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/5 flex flex-col items-center text-center group hover:bg-slate-900/60 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-blue-500/10 group-hover:rotate-6 transition-all duration-500">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-black text-white mb-1 tracking-tight">{number}</div>
      <h3 className="text-sm md:text-base font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-slate-500 text-[10px] md:text-xs uppercase tracking-widest font-semibold">{desc}</p>
    </div>
  );
}