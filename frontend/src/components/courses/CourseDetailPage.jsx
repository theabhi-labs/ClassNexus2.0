import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, IndianRupee, ChevronLeft, CheckCircle2, Clock, 
  Award, BookOpen, Share2, Users, Globe, Wifi, FileText, 
  Briefcase, GraduationCap, Zap, ChevronDown , Heart, 
  Bookmark, ShieldCheck, PlayCircle, Star
} from "lucide-react";
import { getCourses } from "../../api/courses.api";
import ShareModal from "./ShareModal"; // ✅ Import ShareModal

const PublicCourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [openSection, setOpenSection] = useState('overview');
  const [shareModalOpen, setShareModalOpen] = useState(false); // ✅ Share modal state

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

  // ✅ Share handlers
  const handleShareClick = () => {
    setShareModalOpen(true);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.shortDescription,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShareModalOpen(true);
        }
      }
    } else {
      setShareModalOpen(true);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Intermediate': 'bg-amber-100 text-amber-700 border-amber-200',
      'Advanced': 'bg-rose-100 text-rose-700 border-rose-200',
      'All Levels': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[level] || 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getModeIcon = (mode) => {
    if (mode?.toLowerCase() === 'online') return <Wifi className="w-5 h-5" />;
    if (mode?.toLowerCase() === 'offline') return <Users className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 bg-blue-50 rounded-full"></div>
          </div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Excellence...</p>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Course Not Found</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">The curriculum you're looking for might have moved or is no longer available in our catalog.</p>
        <Link to="/courses" className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 inline-flex items-center font-semibold">
          <ChevronLeft className="w-5 h-5 mr-2" /> Explore Other Courses
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Navigation */}
      <nav className="border-b border-slate-200/60 py-4 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/courses" className="flex items-center text-slate-600 hover:text-blue-600 transition-all font-semibold group">
            <div className="p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors mr-2">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" /> 
            </div>
            Catalog
          </Link>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 ${isBookmarked ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-600' : ''}`} />
              <span className="text-sm font-medium hidden sm:block">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            
            {/* ✅ Updated Share Button with handler */}
            <button 
              onClick={handleNativeShare}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:border-slate-300 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={course.thumbnail} 
            alt=""
            className="w-full h-full object-cover opacity-30 scale-105 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-600/20 backdrop-blur-md text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-blue-500/30">
                {course.category || "Professional"}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 text-lg lg:text-xl leading-relaxed mb-8 font-medium">
              {course.shortDescription}
            </p>
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /></div>
                <span className="text-sm font-semibold">Top Rated Program</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck className="w-4 h-4 text-emerald-400" /></div>
                <span className="text-sm font-semibold">Verified Certification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-8">
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Duration</p>
                <p className="font-extrabold text-slate-900">{course.duration.value} {course.duration.unit}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-blue-600 mb-2">{getModeIcon(course.mode)}</div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Learning Mode</p>
                <p className="font-extrabold text-slate-900 capitalize">{course.mode || "Hybrid"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Globe className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Language</p>
                <p className="font-extrabold text-slate-900">{course.language || "English"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <GraduationCap className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Community</p>
                <p className="font-extrabold text-slate-900">{course.students}+ Enrolled</p>
              </div>
            </div>

            {/* Content Tabs Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              {/* Desktop Tabs - Hidden on Mobile */}
              <div className="hidden md:flex p-2 bg-slate-50/50 border-b border-slate-100 overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "Overview", icon: BookOpen },
                  { id: "syllabus", label: "Curriculum", icon: FileText },
                  { id: "skills", label: "Skills", icon: Zap },
                  { id: "career", label: "Outcomes", icon: Briefcase }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Mobile - Accordion Sections */}
              <div className="block md:hidden divide-y divide-slate-100">
                {/* Overview Accordion */}
                <div className="p-4">
                  <button
                    onClick={() => setOpenSection(openSection === 'overview' ? null : 'overview')}
                    className="w-full flex items-center justify-between"
                  >
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Overview
                    </h3>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      openSection === 'overview' ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openSection === 'overview' ? 'max-h-[1000px] mt-4' : 'max-h-0'
                  }`}>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                      {course.description}
                    </p>
                    {course.projectsIncluded > 0 && (
                      <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                        <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-0.5 text-xs">Practical Learning focus</h4>
                          <p className="text-slate-600 text-xs italic">Includes {course.projectsIncluded} real-world projects</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Syllabus Accordion */}
                {course.syllabus?.length > 0 && (
                  <div className="p-4">
                    <button
                      onClick={() => setOpenSection(openSection === 'syllabus' ? null : 'syllabus')}
                      className="w-full flex items-center justify-between"
                    >
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Curriculum ({course.syllabus.length} modules)
                      </h3>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        openSection === 'syllabus' ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openSection === 'syllabus' ? 'max-h-[2000px] mt-4' : 'max-h-0'
                    }`}>
                      <div className="space-y-3">
                        {course.syllabus.map((module, idx) => (
                          <div key={idx} className="border border-slate-100 rounded-xl bg-white">
                            <div className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-slate-200">
                                  {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                <h4 className="font-bold text-slate-800 text-sm">{module.title}</h4>
                              </div>
                              <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-[8px] font-bold text-slate-500">
                                {module.topics?.length || 0} topics
                              </span>
                            </div>
                            <div className="px-3 pb-3 pt-0">
                              <ul className="grid grid-cols-1 gap-1.5 pl-7">
                                {module.topics?.map((topic, i) => (
                                  <li key={i} className="flex items-start text-xs text-slate-600">
                                    <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 mr-2 shrink-0"></div>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills Accordion */}
                {course.skillsYouLearn?.length > 0 && (
                  <div className="p-4">
                    <button
                      onClick={() => setOpenSection(openSection === 'skills' ? null : 'skills')}
                      className="w-full flex items-center justify-between"
                    >
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Skills ({course.skillsYouLearn.length})
                      </h3>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        openSection === 'skills' ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openSection === 'skills' ? 'max-h-[1000px] mt-4' : 'max-h-0'
                    }`}>
                      <div className="grid grid-cols-1 gap-2">
                        {course.skillsYouLearn.map((skill, idx) => (
                          <div key={idx} className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center mr-2">
                              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            </div>
                            <span className="font-medium text-slate-700 text-xs">{skill}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Career Accordion */}
                {course.careerOpportunities?.length > 0 && (
                  <div className="p-4">
                    <button
                      onClick={() => setOpenSection(openSection === 'career' ? null : 'career')}
                      className="w-full flex items-center justify-between"
                    >
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Careers ({course.careerOpportunities.length})
                      </h3>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                        openSection === 'career' ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openSection === 'career' ? 'max-h-[1000px] mt-4' : 'max-h-0'
                    }`}>
                      <div className="grid grid-cols-1 gap-2">
                        {course.careerOpportunities.map((career, idx) => (
                          <div key={idx} className="flex items-center p-3 bg-white rounded-xl border border-slate-100">
                            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center mr-2">
                              <Briefcase className="w-3 h-3 text-indigo-600" />
                            </div>
                            <span className="font-medium text-slate-700 text-xs">{career}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Content - Same as before */}
              <div className="hidden md:block p-8">
                {activeTab === "overview" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Transform your future</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg mb-8">
                      {course.description}
                    </p>
                    {course.projectsIncluded > 0 && (
                      <div className="flex items-start gap-4 p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                        <div className="bg-blue-600 p-3 rounded-xl text-white">
                          <PlayCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1">Practical Learning focus</h4>
                          <p className="text-slate-600 italic">This course includes {course.projectsIncluded} real-world capstone projects to build your professional portfolio.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "syllabus" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    {course.syllabus?.map((module, idx) => (
                      <div key={idx} className="group border border-slate-100 hover:border-blue-200 rounded-2xl transition-all hover:bg-slate-50/50">
                        <div className="p-5 flex items-center justify-between cursor-default">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                              {(idx + 1).toString().padStart(2, '0')}
                            </span>
                            <h4 className="font-bold text-slate-800 tracking-tight">{module.title}</h4>
                          </div>
                          <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">Module</div>
                        </div>
                        <div className="px-5 pb-5 pt-0">
                           <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                              {module.topics?.map((topic, i) => (
                                <li key={i} className="flex items-center text-sm text-slate-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2.5"></div>
                                  {topic}
                                </li>
                              ))}
                           </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500">
                    {course.skillsYouLearn?.map((skill, idx) => (
                      <div key={idx} className="group flex items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-md hover:shadow-blue-50 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </div>
                        <span className="font-bold text-slate-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "career" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500">
                    {course.careerOpportunities?.map((career, idx) => (
                      <div key={idx} className="flex items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mr-4">
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-bold text-slate-700">{career}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checkout / Pricing Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Investment</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-7 h-7 text-slate-900 stroke-[3]" />
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">
                        {course.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold mb-1">
                      Save 33%
                    </span>
                    <p className="text-slate-400 line-through text-sm">₹{(course.price * 1.5).toFixed(0)}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-3">
                      <span>Batch Availability</span>
                      <span className="text-blue-600">Only {course.maxStudents - (course.students || 0)} seats left</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${((course.students || 0) / course.maxStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-200 active:scale-95 text-lg">
                    Enroll Now
                  </button>
                  <button className="w-full bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Talk to Admissions
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" />
                    Package Highlights
                  </h4>
                  <ul className="space-y-3">
                    {[
                      { icon: Award, text: "Official Certification", color: "text-amber-500" },
                      { icon: Zap, text: `${course.projectsIncluded} Industry Projects`, color: "text-blue-500" },
                      { icon: Clock, text: "Lifetime Portal Access", color: "text-purple-500" },
                      { icon: Users, text: "Dedicated Mentor Support", color: "text-emerald-500" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Intake</p>
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(course.createdAt).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ✅ Share Modal - Add at the end */}
      {course && (
        <ShareModal 
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          course={course}
        />
      )}
    </div>
  );
};

export default PublicCourseDetail;