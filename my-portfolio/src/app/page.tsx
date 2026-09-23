import HeroSection from '@/components/HeroSection';
import CertificationsSection from '@/components/CertificationsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectSection from '@/components/ProjectSection';
import SkillsSection from '@/components/SkillsSection';
import ContactSection from '@/components/ContactSection';
import {
  DEFAULT_ABOUT,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_EXPERIENCES,
  DEFAULT_PROJECTS,
} from '@/lib/constants';

export default function Home() {
  return (
    <div className="space-y-4">
      <HeroSection resumeUrl={DEFAULT_ABOUT.resumeUrl} />
      <CertificationsSection certificationsData={DEFAULT_CERTIFICATIONS} />
      <ExperienceSection experienceData={DEFAULT_EXPERIENCES} />
      <ProjectSection projectsData={DEFAULT_PROJECTS} />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}

