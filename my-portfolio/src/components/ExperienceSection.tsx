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
    <section className="py-14 md:py-20 border-b border-[#2e2c2c]" id="experience">
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8e8b8b]">
          <span className="text-white">[*]</span>
          <span>CHRONOLOGY // ENGINEERING_MILESTONES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Experience &amp; Education
        </h2>
        <p className="text-[#8e8b8b] text-xs sm:text-sm max-w-xl font-sans">
          Academic research, technical roles, and distributed engineering milestones.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {experiences.map((exp, index) => (
          <div
            key={exp._id || `${exp.title}-${index}`}
            className="border border-[#2e2c2c] bg-[#171616] p-5 rounded-[4px] space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-[#2e2c2c] pb-3">
              <div>
                <span className="text-[10px] text-[#656363] mr-2">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="inline text-sm sm:text-base font-bold text-white font-sans">
                  {exp.title}
                </h3>
                <span className="text-[#8e8b8b] mx-2">—</span>
                <span className="text-[#cfcecd] font-sans font-medium">
                  {exp.organization}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-[11px] text-[#8e8b8b]">
                <span>[{exp.dates}]</span>
                {exp.location && <span className="text-[#656363]">[{exp.location}]</span>}
              </div>
            </div>

            {/* Description Points */}
            <div className="space-y-1.5 text-xs text-[#cfcecd] font-sans leading-relaxed pt-1">
              {Array.isArray(exp.description) && exp.description.length > 0 ? (
                exp.description.map((point, i) => {
                  const text = typeof point === 'string' ? point : '';
                  if (!text) return null;
                  return (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-[#8e8b8b] flex-shrink-0 select-none">[*]</span>
                      <span>{text}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-[#8e8b8b] flex-shrink-0 select-none">[*]</span>
                  <span>Research and systems development in Artificial Intelligence and Machine Learning.</span>
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