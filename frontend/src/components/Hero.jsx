import { useState, useEffect } from "react";

/* ================= SLIDES ================= */
const slides = [
  {
    url: "https://c8.alamy.com/comp/KX392G/indian-group-college-students-laptop-study-in-classroom-education-KX392G.jpg",
  },
  {
    url: "https://c8.alamy.com/comp/KX3873/group-indian-school-students-book-with-laptop-study-e-learning-class-KX3873.jpg",
  },
  {
    url: "https://c8.alamy.com/comp/JC2CA3/indian-college-friends-student-studying-laptop-library-JC2CA3.jpg",
  },
  {
    url: "https://www.shutterstock.com/image-photo/indian-young-adult-gen-z-260nw-2676889223.jpg",
  },
];

/* ================= HERO SECTION ================= */
export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  /* SLIDER AUTO CHANGE */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  /* STATS ANIMATION */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "!translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    document
      .querySelectorAll("[data-animate='stat']")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ================= HERO SLIDER ================= */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/90 to-black/40" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 max-w-7xl mx-auto">
          <div className="max-w-xl text-white animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Achieve Your Goals <br /> with Quality Education
            </h1>

            <p className="mt-5 text-lg opacity-90">
              Join our expert-led coaching institute for a brighter future.
            </p>

            <button className="mt-7 px-8 py-4 bg-white text-[#1E3A8A] font-semibold rounded-md hover:bg-blue-100 transition">
              Get Started →
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <StatCard number="10+" title="Years Experience" desc="Trusted since 2015" delay={0} />
            <StatCard number="50+" title="Expert Faculty" desc="IIT & NIT experts" delay={100} />
            <StatCard number="1000+" title="Study Notes" desc="Conceptual materials" delay={200} />
            <StatCard number="95%" title="Results" desc="Consistent success" delay={300} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ number, title, desc, delay }) {
  return (
    <div
      data-animate="stat"
      className=" text-center opacity-0 translate-y-6 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-6xl font-bold text-blue-600 mb-4">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
