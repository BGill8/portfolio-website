import Image from 'next/image';
import { BsGithub } from 'react-icons/bs';
import { Code2, ExternalLink, FolderGit2 } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { SanityProject } from '@/lib/types';
import { DEFAULT_PROJECTS } from '@/lib/constants';

interface ProjectSectionProps {
  projectsData?: SanityProject[];
}

const ProjectSection = ({ projectsData }: ProjectSectionProps) => {
  const projects = (projectsData && projectsData.length > 0)
    ? projectsData
    : DEFAULT_PROJECTS;

  return (
    <section className="py-16 md:py-24 border-b border-zinc-800/60" id="projects">
      <div className="space-y-2 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Featured Portfolio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Selected Projects
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
          Autonomous AI agents, machine learning pipelines, and cloud-native systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          let imageSrc: string | null = null;
          if (project.mainImage && project.mainImage.asset) {
            try {
              imageSrc = urlFor(project.mainImage).url();
            } catch {
              imageSrc = null;
            }
          } else if (project.imageUrl) {
            imageSrc = project.imageUrl;
          }

          return (
            <div
              key={project._id || `${project.title}-${index}`}
              className="glass-panel-glow rounded-2xl overflow-hidden flex flex-col justify-between border border-zinc-800 group"
            >
              <div>
                {/* Project Image / Visual Preview */}
                {imageSrc ? (
                  <div className="relative w-full h-48 bg-zinc-900 overflow-hidden border-b border-zinc-800">
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-indigo-950/30 p-5 flex items-center justify-between border-b border-zinc-800/80">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">Project #{index + 1}</span>
                  </div>
                )}

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Links */}
              <div className="p-6 pt-0 mt-auto">
                <div className="pt-4 border-t border-zinc-800/60 flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 px-3 py-1.5 rounded-lg border border-zinc-700/60 transition-colors"
                    >
                      <BsGithub className="w-3.5 h-3.5" />
                      <span>Source</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg shadow-sm shadow-indigo-600/20 transition-colors"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectSection;