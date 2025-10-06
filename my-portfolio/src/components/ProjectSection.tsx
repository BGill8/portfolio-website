import Image from 'next/image';
import { BsGithub, BsGlobe } from 'react-icons/bs';
import { urlFor } from '@/lib/sanity';

// Define the type to match your Sanity schema
type SanityProject = {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  mainImage: {
    asset: {
      _ref: string;
    };
  };
  githubUrl?: string;
  liveUrl?: string;
};

const ProjectsSection = ({ projectsData }: { projectsData: SanityProject[] }) => {
  return (
    <section className="my-20 md:my-32">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Selected Work</h2>
      <div className="space-y-16">
        {projectsData.length > 0 ? (
          projectsData.map((project) => (
            <div key={project._id} className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8 transform transition duration-300 hover:scale-[1.01] hover:shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-4">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-6">
                <span className="font-semibold text-gray-300">Technologies:</span> {project.technologies.join(', ')}
              </p>
              {project.mainImage && (
                <div className="mb-6 rounded-md overflow-hidden border border-gray-700">
                  <Image
                    src={urlFor(project.mainImage).url()}
                    alt={project.title}
                    width={1200}
                    height={675}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
              )}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex space-x-6">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md">
                    <BsGithub className="w-5 h-5" />
                    <span>GitHub Repo</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md">
                    <BsGlobe className="w-5 h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No projects to display yet. Start adding them in your Sanity Studio!</p>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;