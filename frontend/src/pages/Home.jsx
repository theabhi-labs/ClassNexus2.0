import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Courses from "../components/Courses";
import Faculty from "../components/Faculty";
import Footer from "../components/Footer";
import Contact from "../components/Contact";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Courses />
      <Faculty />
      <Contact/>
      <Footer />
    </>
  );
};

export default Home;
