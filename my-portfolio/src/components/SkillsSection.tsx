'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

// Define your Experience type to match your Sanity schema
type SanityExperience = {
  _id: string;
  title: string;
  organization: string;
  location: string;
  dates: string;
  description: any[]; // Sanity Portable Text
};

async function fetchExperience() {
  // Get all documents of type 'experience', sorted by date
  const experience = await client.fetch(`*[_type == "experience"] | order(dates desc){
    _id,
    title,
    organization,
    location,
    dates,
    description
  }`);
  return experience;
}

const ExperienceSection = () => {
  const [experienceData, setExperienceData] = useState<SanityExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getExperience() {
      const fetchedExperience: SanityExperience[] = await fetchExperience();
      setExperienceData(fetchedExperience);
      setLoading(false);
    }
    getExperience();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading experience...</p>;
  }

  return (
    <section className="my-20 md:my-32">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Experience</h2>
      <div className="space-y-8 max-w-3xl mx-auto">
        {experienceData.map((exp) => (
          <div key={exp._id} className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-2xl font-semibold text-white">{exp.title}</h3>
                <p className="text-lg text-gray-400">{exp.organization}, {exp.location}</p>
              </div>
              <span className="text-gray-500 text-sm">{exp.dates}</span>
            </div>
            {/* You'll need a separate component to render Sanity's Portable Text */}
            <div className="description">
              <PortableText value={exp.description} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;