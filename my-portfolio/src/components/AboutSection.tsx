'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/sanity';

// Define your About type to match your Sanity schema
type SanityAbout = {
  _id: string;
  bio: string;
};

async function fetchAbout() {
  // Get the first document of type 'about'
  const about = await client.fetch(`*[_type == "about"][0]{
    _id,
    bio
  }`);
  return about;
}

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<SanityAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAbout() {
      const fetchedAbout: SanityAbout = await fetchAbout();
      setAboutData(fetchedAbout);
      setLoading(false);
    }
    getAbout();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading bio...</p>;
  }

  return (
    <section className="my-16">
      <h2 className="text-3xl font-semibold text-white border-b-2 border-gray-500 pb-2 mb-8">About Me</h2>
      {aboutData && (
        <p className="text-lg text-gray-400 leading-relaxed">
          {aboutData.bio}
        </p>
      )}
    </section>
  );
};

export default AboutSection;