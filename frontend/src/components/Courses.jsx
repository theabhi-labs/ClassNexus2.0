// components/Courses.tsx
import { BookOpen, Calendar, IndianRupee } from 'lucide-react';
import { Element } from 'react-scroll';

const courses = [
  {
    name: "JEE Main + Advanced Preparation",
    duration: "1 Year / 2 Year",
    fee: "₹45,000",
    description: "Complete syllabus coverage with regular tests, doubt sessions & previous year analysis",
    poster: "https://content.jdmagicbox.com/comp/kanpur/t3/0512px512.x512.230418171339.x3t3/catalogue/mathematics-for-iit-jee-by-vinay-tiwari-kakadeo-kanpur-tutorials-for-iit-jee-68e5ha71bo.jpg",
  },
  {
    name: "NEET UG Coaching",
    duration: "1 Year / 2 Year",
    fee: "₹45,000",
    description: "Biology, Physics & Chemistry expert faculty + daily practice + mock tests",
    poster: "https://mgci.co.in/wp-content/uploads/2025/10/Banner-8.jpg",
  },
  {
    name: "SSC CGL / CHSL / MTS",
    duration: "6–12 Months",
    fee: "₹30,000",
    description: "Quantitative Aptitude, Reasoning, English & GK with current affairs updates",
    poster: "https://media.licdn.com/dms/image/v2/D5612AQGDLffJG8FYhg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1735642914964?e=2147483647&v=beta&t=z7qykkBxfBc5MHu6BGqF2KYTP3kK3dod4-QvphQ9Ca4",
  },
];

const Courses = () => {
  return (
    <Element name='courses'>
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Our Most Popular Courses
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Structured programs designed for success in India's toughest competitive exams
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {courses.map((course) => (
            <div
              key={course.name}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 flex flex-col"
            >
              {/* Course Poster / Banner */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={course.poster}
                  alt={`${course.name} poster`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl md:text-2xl font-bold drop-shadow-md">
                    {course.name}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 md:p-7 flex flex-col flex-grow">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="font-medium">{course.duration}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <IndianRupee className="w-5 h-5 mr-3 text-blue-600" />
                    <span className="font-bold text-xl text-gray-900">{course.fee}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                  {course.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Join Now
                  </button>

                  <button
                    className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors hover:bg-gray-50"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: See All Courses button */}
        <div className="text-center mt-12">
          <button className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            View All Courses →
          </button>
        </div>
      </div>
    </section>
    </Element>
  );
};

export default Courses;