import { useEffect, useState, useMemo } from "react";
import { Search, Filter, BookOpen, Clock, ChevronRight } from "lucide-react";
import { getCourses } from "../../api/courses.api";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        if (res.data.success) setCourses(res.data.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter Logic: Calculated on every state change for Search or Category
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, activeCategory]);

  // Unique categories for the filter sidebar
  const categories = ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our Course Catalog</h1>
            <p className="text-slate-500 mt-2">Explore {courses.length} specialized programs</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 font-bold text-slate-800">
                <Filter className="w-4 h-4" /> Categories
              </div>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap text-left ${
                      activeCategory === cat 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content: Course Grid */}
          <main className="flex-1">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Individual Course Card
const CourseCard = ({ course }) => (
  <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
    <div className="relative aspect-video overflow-hidden">
      <img 
        src={course.thumbnail} 
        alt={course.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm uppercase">
          {course.category || "General"}
        </span>
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow">{course.description}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center text-slate-700 font-bold">
          <span className="text-blue-600 text-sm mr-1">₹</span>
          {course.price}
        </div>
        <a 
          href={`/courses/${course._id}`}
          className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Course <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  </div>
);

// Sub-component: Loading State
const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto py-16 px-5 animate-pulse">
    <div className="h-10 w-48 bg-slate-200 rounded-lg mb-8" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100">
          <div className="aspect-video bg-slate-200 rounded-2xl mb-4" />
          <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />
          <div className="h-4 w-full bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default AllCoursesPage;