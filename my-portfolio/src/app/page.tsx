import { client } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
import Image from 'next/image';
import ProjectSection from '@/components/ProjectSection';
import SkillsSection from '@/components/SkillsSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';

const Home = async () => {
  // Fetch all data in one go
  const data = await client.fetch(`{
    "about": *[_type == "about"][0]{ bio, "resumeUrl": resumeFile.asset->url, profilePic },
    "experience": *[_type == "experience"] | order(dates desc){ title, organization, dates, description, location },
    "skills": *[_type == "skill"]{ name, icon },
    "projects": *[_type == "project"] | order(_createdAt desc){ _id, title, description, technologies, mainImage, githubUrl, liveUrl }
  }`);

  // Extract data for each section
  const { about, experience, skills, projects } = data;

  // Words for the hero section
  const words = ["purposeful", "impactful", "engaging", "innovative"];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0">
      <section className="text-center my-20 md:my-32">
        <div className="mb-4">
          {/* <div className="w-24 h-24 mx-auto bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-sm">
            {about?.profilePic && (
              <Image 
                src={urlFor(about.profilePic).url()}
                alt="Profile picture" 
                width={96} 
                height={96}
                className="rounded-full"
              />
            )}
          </div> */}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700">
            Hi, I'm Brandon Gill
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Third Year Computer Science Student at the University of Oregon
            Specializing in Artificial Intelligence
        </p>
        <a href={about?.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:cursor-pointer">
          View Resume
        </a>
      </section>

      <AboutSection aboutData={about} />
      <ExperienceSection experienceData={experience} />
      <SkillsSection skillsData={skills} />
      <ProjectSection projectsData={projects} />

      <section className="text-center my-20 md:my-4">
        <h2 className="text-3xl font-semibold text-white mb-12">Get in Touch</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-4xl mx-auto">
          I'm currently seeking new opportunities and always open to discussing new projects or collaborations.
        </p>
        <a href="mailto:brandongill9432@gmail.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
          Send me an Email
        </a>
        <div className="flex justify-center space-x-6 mt-8">
          <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-400 hover:text-blue-500 transition-colors">LinkedIn</a>
          <a href="https://github.com/BGill8" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-400 hover:text-blue-500 transition-colors">GitHub</a>
          <a href="https://instagram.com/brandonkngill" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-400 hover:text-blue-500 transition-colors">Instagram</a>
        </div>
      </section>
    </div>
  );
};

export default Home;