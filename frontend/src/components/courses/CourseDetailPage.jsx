import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  IndianRupee, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen,
  Share2
} from "lucide-react";
import { getCourses } from "../../api/courses.api";

const PublicCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourses();
        if (res.data.success) {
          const found = res.data.data.find(c => c._id === courseId);
          setCourse(found || null);
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-800">Course not found</h2>
      <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">Return to catalog</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Navigation Bar */}
      <nav className="border-b border-slate-100 py-4 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/courses" className="flex items-center text-slate-600 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" /> All Courses
          </Link>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Share2 className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Content */}
          <div className="flex-1 order-2 lg:order-1">
            <header className="mb-8">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {course.category || "Professional Program"}
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">
                {course.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-slate-600">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">{course.duration.value} {course.duration.unit}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="font-medium">Hands-on Training</span>
                </div>
              </div>
            </header>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">About this course</h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>

            {/* Course Outcomes / Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Practical Lab Sessions",
                "Industry Expert Mentors",
                "Placement Assistance"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Pricing Card */}
          <aside className="lg:w-[400px] order-1 lg:order-2">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-video">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <IndianRupee className="w-8 h-8 text-slate-900" />
                  <span className="text-4xl font-black text-slate-900">{course.price.toLocaleString()}</span>
                  <span className="ml-2 text-slate-400 text-sm line-through">₹{(course.price * 1.5).toFixed(0)}</span>
                </div>

                <div className="space-y-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200">
                    Enroll Now
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    * Registration subject to availability at the center
                  </p>
                </div>

                <hr className="my-8 border-slate-100" />

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" /> Course Includes:
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-3">
                    <li className="flex items-center">Certificate of completion</li>
                    <li className="flex items-center">Direct mentor support</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PublicCourseDetail;