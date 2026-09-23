import { BsGithub } from 'react-icons/bs';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/lib/types';
import { DEFAULT_PROJECTS } from '@/lib/constants';

interface ProjectSectionProps {
  projectsData?: Project[];
}

const ProjectSection = ({ projectsData }: ProjectSectionProps) => {
  const projects = (projectsData && projectsData.length > 0)
    ? projectsData
    : DEFAULT_PROJECTS;

  return (
    <section className="py-14 md:py-20 border-b border-[#2e2c2c]" id="projects">
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8e8b8b]">
          <span className="text-white">[*]</span>
          <span>SYSTEMS // OPEN_SOURCE_REPOSITORIES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Selected Projects
        </h2>
        <p className="text-[#8e8b8b] text-xs sm:text-sm max-w-xl font-sans">
          Autonomous AI agents, machine learning pipelines, and cloud-native software architectures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => {
          return (
            <div
              key={project._id || `${project.title}-${index}`}
              className="border border-[#2e2c2c] bg-[#171616] hover:bg-[#1c1b1b] hover:border-[#3b3939] rounded-[4px] p-5 flex flex-col justify-between transition-colors"
            >
              <div>
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between font-mono text-xs text-[#8e8b8b] mb-3 pb-2 border-b border-[#2e2c2c]">
                  <span>[PROJ_{String(index + 1).padStart(2, '0')}]</span>
                  {project.liveUrl && (
                    <span className="text-[#03B000] text-[10px] bg-[#03B000]/10 border border-[#03B000]/30 px-1.5 py-0.5 rounded-[2px]">
                      LIVE
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white font-sans mb-2">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#8e8b8b] font-sans leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-[#cfcecd] bg-[#131111] border border-[#2e2c2c] px-2 py-0.5 rounded-[2px]"
                      >
                        [{tech}]
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-[#2e2c2c] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center space-x-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#cfcecd] hover:text-white transition-colors"
                    >
                      <BsGithub className="w-3.5 h-3.5" />
                      <span>source</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="inline-flex items-center gap-1 text-[#03B000] hover:text-emerald-300 transition-colors"
                    >
                      <span>launch app</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-[#656363]">v2.0</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectSection;