import Image from 'next/image'; // For optimized images
import { skills } from '@/data/skills';

const SkillsSection = () => {
  return (
    <section className="my-20 md:my-32 text-center">
      <h2 className="text-3xl font-bold text-white mb-12">Skills & Technologies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
        {skills.map((skill) => (
          <div key={skill.name} className="flex flex-col items-center p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-md transform transition duration-300 hover:scale-105 hover:bg-gray-700">
            <Image
              src={skill.icon}
              alt={skill.name}
              width={64}
              height={64}
              className="mb-2"
            />
            <span className="text-white text-sm font-medium">{skill.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;