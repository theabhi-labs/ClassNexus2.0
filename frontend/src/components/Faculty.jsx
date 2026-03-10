import { useState } from "react";
import { User, Linkedin, Mail, X, ExternalLink, Award, GraduationCap } from 'lucide-react'; 
import { Element } from 'react-scroll';

const faculty = [
  {
    id: 1,
    name: "Mr. Akash Verma",
    subject: "Full-Stack Development",
    qualification: "B.Tech Computer Science | 8+ Years Experience",
    photo: "https://images.unsplash.com/photo-1603415526960-f7e0328b03c4?w=400",
    bio: "Mr. Akash specializes in MERN stack development, building real-world projects, and mentoring students in coding best practices. He has successfully trained over 500+ students for top-tier MNCs.",
  },
  {
    id: 2,
    name: "Ms. Priya Singh",
    subject: "Data Science & AI",
    qualification: "M.Tech AI | 6+ Years Experience",
    photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400",
    bio: "Ms. Priya has expertise in Python, Machine Learning, and AI algorithms, helping students implement projects and understand real-world data problems.",
  },
  {
    id: 3,
    name: "Mr. Rahul Kapoor",
    subject: "Cybersecurity",
    qualification: "B.Tech IT | CEH Certified | 7+ Years Experience",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Mr. Rahul teaches network security, penetration testing, and ethical hacking, preparing students for certifications and real-world security challenges.",
  },
  {
    id: 4,
    name: "Ms. Neha Rani",
    subject: "Web Design & UI/UX",
    qualification: "B.Des Graphic Design | 5+ Years Experience",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    bio: "Ms. Neha is an expert in web design, UI/UX, and frontend technologies like Figma, guiding students to create industry-standard digital products.",
  },
];

const PublicFaculty = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  return (
    <Element name='faculty'>
      <section className="py-20 lg:py-28 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Learn from <span className="text-blue-600">Industry Giants</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Our faculty members aren't just teachers; they are practitioners who bring 
              years of real-world corporate experience to the classroom.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedFaculty(member)}
                className="group relative bg-white rounded-[2rem] border border-slate-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Glass Social Bar */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-white/20 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <button className="p-2 bg-white rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-xl text-slate-700 hover:bg-slate-700 hover:text-white transition-all">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 text-center">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h4>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">
                    {member.subject}
                  </p>
                  <div className="flex items-center justify-center text-slate-500 text-xs gap-1.5 font-medium border-t border-slate-50 pt-4">
                    <Award className="w-3.5 h-3.5 text-blue-400" />
                    {member.qualification.split('|')[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Profile Modal */}
          {selectedFaculty && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
                onClick={() => setSelectedFaculty(null)}
              />
              
              <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>

                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-64 md:h-auto">
                    <img
                      src={selectedFaculty.photo}
                      alt={selectedFaculty.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-8 md:p-10">
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">
                      Faculty Profile
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 mt-2 mb-1">
                      {selectedFaculty.name}
                    </h3>
                    <p className="text-blue-600 font-bold mb-6 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" /> {selectedFaculty.subject}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-400 uppercase mb-1">Expertise & Background</p>
                        <p className="text-slate-700 leading-relaxed italic text-sm">
                          "{selectedFaculty.bio}"
                        </p>
                      </div>
                      
                      <div className="flex gap-4">
                        <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                          Connect <Linkedin className="w-4 h-4" />
                        </button>
                        <button className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                          Email <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Call-to-action */}
          <div className="mt-20 text-center">
            <a
              href="/faculty"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold hover:bg-slate-50 hover:border-blue-200 transition-all group"
            >
              Meet Our Entire Team
              <ExternalLink className="w-5 h-5 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </Element>
  );
};

export default PublicFaculty;