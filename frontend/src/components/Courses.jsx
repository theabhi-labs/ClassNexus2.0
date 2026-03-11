import { useEffect, useState } from "react";
import { Calendar, IndianRupee, ArrowRight, Info, CheckCircle, ImageOff } from "lucide-react";
import { Element } from "react-scroll";
import { getCourses } from "../api/courses.api";
import { Link } from "react-router-dom";

const PublicCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinMsg, setJoinMsg] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        if (res.data.success) {
          setCourses(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleJoin = (courseName) => {
    setJoinMsg(`Enrollment for "${courseName}" is handled in-person. Visit us to register!`);
    setTimeout(() => setJoinMsg(""), 5000);
  };

  // Helper function to check if URL is a direct image link
  const getValidImage = (url) => {
    if (url && url.includes("images.unsplash.com")) {
      return url;
    }
    // Default high-quality placeholder if URL is a webpage link or missing
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <Element name="courses" className="bg-slate-50">
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Header Section */}
          <header className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Master the <span className="text-blue-600">Digital World</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Step into the future with hands-on training. From fundamentals to expert-level skills,
              we bridge the gap between learning and doing.
            </p>
          </header>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {courses.slice(0, 6).map((course) => (
              <article
                key={course._id}
                className="group relative bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={getValidImage(course.thumbnail)}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800";
                    }}
                  />

                  {/* Visual Quality Check Label */}
                  {!course.thumbnail?.includes("images.unsplash.com") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]">
                      <div className="bg-white/90 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl">
                        <ImageOff className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Preview Optimized</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-60" />
                  <span className="absolute top-5 right-5 bg-white/95 backdrop-blur-md text-blue-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-sm">
                    {course.category || "Popular"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {course.title}
                  </h3>

                  <div className="flex flex-wrap gap-5 mb-6">
                    <div className="flex items-center text-slate-500 text-sm font-bold bg-slate-50 px-3 py-1 rounded-lg">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {course.duration.value} {course.duration.unit}
                    </div>
                    <div className="flex items-center text-slate-900 text-xl font-black">
                      <IndianRupee className="w-4 h-4 mr-0.5 text-green-600" />
                      {course.price.toLocaleString()}
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
                    {course.description.length > 110
                      ? `${course.description.substring(0, 110)}...`
                      : course.description}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleJoin(course.title)}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-200"
                    >
                      Join Now
                    </button>
                    <Link
                      to={`/courses/${course._id}`}
                      className="inline-flex items-center justify-center border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 text-slate-700 font-bold py-4 px-4 rounded-2xl transition-all"
                    >
                      Details <Info className="w-4 h-4 ml-2 opacity-40" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer Call-to-Action */}
          <div className="mt-20 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-3xl text-slate-900 font-black text-lg hover:shadow-xl hover:border-blue-200 transition-all group"
            >
              Explore all 50+ Specialized Courses
              <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dynamic Toast Notification */}
        {joinMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="bg-slate-900/95 backdrop-blur-xl text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10">
              <div className="bg-green-500 rounded-full p-1">
                <CheckCircle className="text-white w-5 h-5" />
              </div>
              <span className="text-sm font-bold tracking-tight">{joinMsg}</span>
            </div>
          </div>
        )}
      </section>
    </Element>
  );
};

export default PublicCourses;