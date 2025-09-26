export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center my-16">
        <h1 className="text-5xl font-bold text-white mb-4">Hello, I'm [Your Name]</h1>
        <p className="text-xl text-gray-300">A passionate web developer with experience in creating dynamic and responsive user interfaces.</p>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-semibold text-white border-b-2 border-gray-500 pb-2 mb-8">About Me</h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          I am a student at Oregon State University with a passion for front-end and full-stack development. I have a strong foundation in HTML, CSS, and JavaScript, and extensive experience with modern frameworks like Next.js and React. My volunteer experience at [Volunteer Organization Name] and my participation in the BeaverHacks hackathon have provided me with hands-on experience in building robust applications using technologies like TypeScript, Tailwind CSS, Prisma, and PostgreSQL. I am always eager to learn new technologies and apply them to create innovative solutions.
        </p>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-semibold text-white border-b-2 border-gray-500 pb-2 mb-8">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project 1 */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold text-white mb-2">BeaverHacks Web Design</h3>
            <p className="text-gray-400 text-sm mb-4">
              <span className="font-semibold text-gray-300">Technologies:</span> Next.js, React, TypeScript, Tailwind CSS
            </p>
            <p className="text-gray-300 mb-4">
              A responsive web application built during the BeaverHacks event. This project showcases my ability to work on a tight deadline and deliver a functional, well-designed product using a modern tech stack.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/yourusername/beaverhacks-project" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">GitHub Repo</a>
              <a href="https://beaverhacks.vercel.app" target="_blank" rel="noopener noreferrer" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Live Demo</a>
            </div>
          </div>

          {/* Project 2 - Add more projects here */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg transform transition duration-300 hover:scale-105">
            <h3 className="text-2xl font-bold text-white mb-2">My Portfolio Website</h3>
            <p className="text-gray-400 text-sm mb-4">
              <span className="font-semibold text-gray-300">Technologies:</span> Next.js, React, TypeScript, Tailwind CSS
            </p>
            <p className="text-gray-300 mb-4">
              The very website you are viewing! This project was created to demonstrate a professional and elegant solution for showcasing my skills and projects, built from scratch with a focus on clean code and performance.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/yourusername/my-portfolio" target="_blank" rel="noopener noreferrer" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">GitHub Repo</a>
              <a href="https://my-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Live Site</a>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center my-16">
        <h2 className="text-3xl font-semibold text-white border-b-2 border-gray-500 pb-2 mb-8">Contact</h2>
        <p className="text-lg text-gray-400 mb-4">
          Feel free to reach out to me!
        </p>
        <div className="flex justify-center space-x-6">
          <a href="mailto:youremail@example.com" className="text-xl text-purple-400 hover:text-purple-600 transition-colors">Email</a>
          <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer" className="text-xl text-purple-400 hover:text-purple-600 transition-colors">LinkedIn</a>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-xl text-purple-400 hover:text-purple-600 transition-colors">GitHub</a>
        </div>
      </section>
    </div>
  );
}