import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { SanityExperience } from '@/lib/types';
import { DEFAULT_EXPERIENCES } from '@/lib/constants';

interface ExperienceSectionProps {
  experienceData?: SanityExperience[];
}

const ExperienceSection = ({ experienceData }: ExperienceSectionProps) => {
  const experiences = (experienceData && experienceData.length > 0)
    ? experienceData
    : DEFAULT_EXPERIENCES;

  return (
    <section className="py-16 md:py-24 border-b border-zinc-800/60" id="experience">
      <div className="space-y-2 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Background</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Experience & Education
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
          Academic research, technical roles, and engineering milestones.
        </p>
      </div>

      <div className="relative border-l border-zinc-800 ml-3 sm:ml-6 space-y-8">
        {experiences.map((exp, index) => (
          <div key={exp._id || `${exp.title}-${index}`} className="relative pl-6 sm:pl-8 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-indigo-500 group-hover:border-indigo-400 group-hover:scale-110 transition-all" />

            <div className="glass-panel-glow rounded-2xl p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-300">
                    {exp.organization}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/50">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>{exp.dates}</span>
                  </span>
                  {exp.location && (
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description handling for PortableText or array of strings */}
              <div className="text-sm text-zinc-300 leading-relaxed mb-4">
                {Array.isArray(exp.description) ? (
                  typeof exp.description[0] === 'string' ? (
                    <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
                      {(exp.description as string[]).map((point, i) => (
                        <li key={i} className="text-zinc-300">{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="prose prose-invert max-w-none text-zinc-300 text-sm">
                      <PortableText value={exp.description as PortableTextBlock[]} />
                    </div>
                  )
                ) : null}
              </div>

              {/* Skills Tags */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/60">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium text-indigo-300 bg-indigo-950/40 border border-indigo-800/30 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;