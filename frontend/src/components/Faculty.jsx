// components/Faculty.tsx
import { User, GraduationCap, Linkedin, Mail } from 'lucide-react'; 
import { Element } from 'react-scroll';

const faculty = [
  {
    name: "Prof. Anil Sharma",
    subject: "Physics",
    qualification: "M.Sc. Physics, IIT Bombay | 18+ Years Exp.",
    image: "https://images.unsplash.com/photo-1556155099-490a1ba16284?w=400",
  },
  {
    name: "Mrs. Ritu Verma",
    subject: "Chemistry",
    qualification: "Ph.D. Organic Chemistry | Ex-Allen Faculty",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
  },
  {
    name: "Mr. Rajesh Patel",
    subject: "Mathematics",
    qualification: "M.Tech, IIT Delhi | 15+ Years Teaching",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400",
  },
  {
    name: "Ms. Sonia Gupta",
    subject: "English & Reasoning",
    qualification: "MA English, NET Qualified | 12+ Years Exp.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400",
  },
];

const Faculty = () => {
  return (
    <Element name='faculty'>
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Meet Our Expert Faculty
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experienced educators from top institutions committed to your success
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {faculty.map((member) => (
            <div
              key={member.name}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                  {member.name}
                </h4>
                <p className="text-blue-600 font-medium mb-2">{member.subject}</p>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  {member.qualification}
                </p>

                {/* Action Buttons / Icons */}
                <div className="flex justify-center gap-4">
                  <button
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="View Profile"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>

                {/* Optional: View Full Profile Button */}
                <button className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  View Full Profile →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: More Faculty link */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Meet Our Full Team <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
    </Element>
  );
};

export default Faculty;