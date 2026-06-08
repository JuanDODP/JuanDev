import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import TechStack from '../components/sections/TechStack';
import AIShowcase from '../components/sections/AIShowcase';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <AIShowcase />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
