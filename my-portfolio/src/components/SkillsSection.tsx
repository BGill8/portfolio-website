import { useMemo } from 'react';
import { Skill } from '@/lib/types';
import { DEFAULT_SKILL_CATEGORIES } from '@/lib/constants';

interface SkillsSectionProps {
  skillsData?: Skill[];
}

const SkillsSection = ({ skillsData }: SkillsSectionProps) => {
  const categories = useMemo(() => {
    if (!skillsData || skillsData.length === 0) {
      return DEFAULT_SKILL_CATEGORIES;
    }
    const map = new Map<string, string[]>();
    for (const s of skillsData) {
      const catName = s.category || 'Core';
      const existing = map.get(catName) || [];
      existing.push(s.name);
      map.set(catName, existing);
    }
    return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }));
  }, [skillsData]);
  return (
    <section className="py-14 md:py-20 border-b border-[#2e2c2c]" id="skills">
      <div className="space-y-2 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8e8b8b]">
          <span className="text-white">[*]</span>
          <span>COMPETENCY_MATRIX // TOOLING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Skills &amp; Technologies
        </h2>
        <p className="text-[#8e8b8b] text-xs sm:text-sm max-w-xl font-sans">
          Core proficiencies spanning machine learning engineering, distributed systems, and cloud infrastructure.
        </p>
      </div>

      {/* Grid of Skill Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="border border-[#2e2c2c] bg-[#171616] p-5 rounded-[4px] space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#2e2c2c] font-mono text-xs">
              <span className="text-white font-semibold">{cat.category}</span>
              <span className="text-[10px] text-[#656363]">[{cat.skills.length}_MODULES]</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono text-[#cfcecd] hover:text-white bg-[#131111] hover:bg-[#1f1d1d] border border-[#2e2c2c] hover:border-[#3b3939] px-2.5 py-1 rounded-[2px] transition-colors cursor-default"
                >
                  [{skill}]
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;