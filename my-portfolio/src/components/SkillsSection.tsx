import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

// Define your Skill type
type SanitySkill = {
  _id: string;
  name: string;
  icon: {
    asset: {
      _ref: string;
    };
  }
};

const SkillsSection = ({ skillsData }: { skillsData: SanitySkill[] }) => {
  return (
    <section className="my-20 md:my-32">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Skills</h2>
      <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
        {skillsData.map((skill) => (
          <div key={skill._id} className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 p-4 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
              <Image
                src={urlFor(skill.icon).url()}
                alt={`${skill.name} icon`}
                width={48}
                height={48}
              />
            </div>
            <p className="text-gray-300">{skill.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;