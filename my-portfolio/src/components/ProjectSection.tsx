'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BsGithub, BsGlobe } from 'react-icons/bs';
import { client, urlFor } from '@/lib/sanity';

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

// Define a separate function to fetch the data
async function fetchProjects() {
  const projects = await client.fetch(`*[_type == "project"]{
    _id,
    title,
    description,
    technologies,
    mainImage,
    githubUrl,
    liveUrl
  }`);
  return projects;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<SanityProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProjects() {
      const fetchedProjects: SanityProject[] = await fetchProjects();
      setProjects(fetchedProjects);
      setLoading(false);
    }
    getProjects();
  }, []);

  if (loading) {
    return (
      <section className="my-20 md:my-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Selected Work</h2>
        <p className="text-gray-400">Loading projects...</p>
      </section>
    );
  }

  return (
    <section className="my-20 md:my-32">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Selected Work</h2>
      <div className="space-y-16">
        {projects.length > 0 ? (
          projects.map((project) => (
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
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-md">
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