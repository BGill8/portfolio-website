'use client';
import { useEffect, useState } from 'react';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';

const Home = () => {
  const words = ["purposeful", "impactful", "engaging", "innovative"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Introduction/Hero Section */}
      <section className="text-center my-20 md:my-32">
        <div className="mb-4">
          <div className="w-24 h-24 mx-auto bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-sm">
            [Your Pic]
          </div>
        </div>
        <p className="text-xl text-gray-300 mb-2">Hello, I'm [Your Name] 👋, creating</p>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 transition-opacity duration-1000 ease-in-out">
            {words[currentWordIndex]}
          </span> experiences,<br />
          results & stories.
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          A passionate Web Developer with a knack for building dynamic, user-friendly, and performant web applications.
        </p>
        <a href="/path-to-your-resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
          View Resume
        </a>
      </section>

      {/* About Section (Dynamic) */}
      <AboutSection />

      {/* Experience Section (Dynamic) */}
      <ExperienceSection />

      {/* Skills Section (Dynamic) */}
      <SkillsSection />

      {/* Projects Section (Dynamic) */}
      <ProjectsSection />

      {/* Contact Section (Hardcoded - you can leave this as is) */}
      <section className="text-center my-20 md:my-32">
        <h2 className="text-3xl font-semibold text-white mb-12">Get in Touch</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          I'm currently seeking new opportunities and always open to discussing new projects or collaborations.
        </p>
        <a href="mailto:youremail@example.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
          Send me an Email
        </a>
        <div className="flex justify-center space-x-6 mt-8">
          <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-400 hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-400 hover:text-white transition-colors">GitHub</a>
        </div>
      </section>
    </div>
  );
};

export default Home;