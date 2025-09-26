import { useEffect, useState } from 'react'; // Import useEffect and useState for dynamic text

const Home = () => {
  const words = ["purposeful", "impactful", "engaging", "innovative"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000); // Change word every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      {/* Introduction/Hero Section */}
      <section className="text-center my-20 md:my-32">
        <div className="mb-4">
          {/* Replace with your image */}
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

      {/* Experience Section */}
      <section className="my-20 md:my-32">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Experience</h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Internship/Volunteer Experience */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-2xl font-semibold text-white">Web Developer Intern / Volunteer</h3>
                <p className="text-lg text-gray-400">[Organization Name], [City, State]</p>
              </div>
              <span className="text-gray-500 text-sm">Jan 2023 - Present</span>
            </div>
            <p className="text-gray-300 mb-4">
              Contributed to the development of full-stack applications using Next.js, React, TypeScript, and Tailwind CSS. Utilized Prisma and PostgreSQL for database management. Focused on creating responsive and accessible user interfaces.
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
              <li>Developed and maintained features for a key internal tool using Next.js and TypeScript.</li>
              <li>Implemented responsive designs with Tailwind CSS, ensuring cross-device compatibility.</li>
              <li>Managed database schemas and queries with Prisma and PostgreSQL.</li>
            </ul>
          </div>

          {/* BeaverHacks Experience (if you want to list it as a project or activity, not formal "experience") */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-2xl font-semibold text-white">Participant / Web Designer</h3>
                <p className="text-lg text-gray-400">BeaverHacks, Oregon State University</p>
              </div>
              <span className="text-gray-500 text-sm">Fall 2023</span> {/* Example Date */}
            </div>
            <p className="text-gray-300 mb-4">
              Collaborated in a team to design and develop a web application within a limited timeframe. Applied skills in UI/UX design, front-end development, and problem-solving.
            </p>
            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
              <li>Engineered interactive front-end components using React and JavaScript.</li>
              <li>Successfully met project goals under hackathon constraints.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section - Placeholder for now, will create a component */}
      <section className="my-20 md:my-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Skills & Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
          {/* Icons will go here, dynamically rendered */}
          {/* Example: */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
            <img src="/icons/nextjs.svg" alt="Next.js" className="w-16 h-16 mb-2" />
            <span className="text-white text-sm">Next.js</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
            <img src="/icons/react.svg" alt="React" className="w-16 h-16 mb-2" />
            <span className="text-white text-sm">React</span>
          </div>
          {/* ... more skills ... */}
        </div>
      </section>

      {/* Projects Section - Placeholder for now, will create a component */}
      <section className="my-20 md:my-32">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Selected Work</h2>
        {/* Dynamic projects will be rendered here */}
        {/* Example Project Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8 transform transition duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <h3 className="text-2xl font-semibold text-white mb-2">Project Title</h3>
          <p className="text-gray-400 text-sm mb-4">
            <span className="font-semibold text-gray-300">Technologies:</span> Next.js, TypeScript, Tailwind CSS
          </p>
          {/* Image goes here */}
          <div className="w-full h-64 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-400">
            Project Image Placeholder
          </div>
          <p className="text-gray-300 mb-4">
            A brief description of the project, highlighting its purpose, your role, and key features.
          </p>
          <div className="flex space-x-4">
            <a href="https://github.com/yourusername/project-repo" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">GitHub Repo</a>
            <a href="https://live-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Live Demo</a>
          </div>
        </div>
        {/* More project cards... */}
      </section>

      {/* Contact Section */}
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