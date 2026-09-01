import Image from 'next/image';
import { Cpu, Layers } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { SanitySkill } from '@/lib/types';
import { DEFAULT_SKILL_CATEGORIES } from '@/lib/constants';

interface SkillsSectionProps {
  skillsData?: SanitySkill[];
}

const SkillsSection = ({ skillsData }: SkillsSectionProps) => {
  const hasCmsSkills = skillsData && skillsData.length > 0;

  return (
    <section className="py-16 md:py-24 border-b border-zinc-800/60" id="skills">
      <div className="space-y-2 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>Technical Proficiencies</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Skills & Technologies
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
          Core competencies spanning machine learning research, distributed AI systems, and cloud infrastructure.
        </p>
      </div>

      {/* Categorized Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_SKILL_CATEGORIES.map((cat) => (
          <div
            key={cat.category}
            className="glass-panel rounded-2xl p-6 border border-zinc-800"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/80">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-semibold text-zinc-100">
                {cat.category}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* If Sanity CMS has custom individual skill icons */}
      {hasCmsSkills && (
        <div className="mt-8 pt-6 border-t border-zinc-800/60">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
            Additional Tools & Libraries
          </h4>
          <div className="flex flex-wrap items-center gap-4">
            {skillsData.map((skill) => {
              let iconUrl: string | null = null;
              if (skill.icon && skill.icon.asset) {
                try {
                  iconUrl = urlFor(skill.icon).url();
                } catch {
                  iconUrl = null;
                }
              }

              return (
                <div
                  key={skill._id || skill.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300"
                >
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt={skill.name}
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SkillsSection;