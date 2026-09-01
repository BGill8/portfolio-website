import { client } from '@/lib/sanity';
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
import {
  SanityCertification,
  SanityExperience,
  SanityProject,
  SanitySkill,
} from '@/lib/types';

export const revalidate = 60; // Revalidate every minute

async function getPortfolioData() {
  try {
    const data = await client.fetch(
      `{
        "about": *[_type == "about"][0]{
          bio,
          headline,
          subheadline,
          "resumeUrl": resumeFile.asset->url,
          profilePic
        },
        "certifications": *[_type == "certification"] | order(orderRank asc){
          _id,
          title,
          issuer,
          issueDate,
          expiryDate,
          credlyUrl,
          badgeImage,
          description,
          skills,
          orderRank
        },
        "experience": *[_type == "experience"] | order(orderRank asc){
          _id,
          title,
          organization,
          dates,
          description,
          location,
          skills,
          orderRank
        },
        "skills": *[_type == "skill"] | order(orderRank asc){
          _id,
          name,
          category,
          icon,
          orderRank
        },
        "projects": *[_type == "project"] | order(orderRank asc){
          _id,
          title,
          description,
          technologies,
          mainImage,
          githubUrl,
          liveUrl,
          orderRank
        }
      }`,
      {},
      { next: { tags: ['sanity'] } }
    );

    return {
      about: data?.about || DEFAULT_ABOUT,
      certifications:
        data?.certifications && data.certifications.length > 0
          ? (data.certifications as SanityCertification[])
          : DEFAULT_CERTIFICATIONS,
      experience:
        data?.experience && data.experience.length > 0
          ? (data.experience as SanityExperience[])
          : DEFAULT_EXPERIENCES,
      skills: (data?.skills as SanitySkill[]) || [],
      projects:
        data?.projects && data.projects.length > 0
          ? (data.projects as SanityProject[])
          : DEFAULT_PROJECTS,
    };
  } catch (error) {
    console.warn('Sanity fetch fallback active:', error instanceof Error ? error.message : error);
    return {
      about: DEFAULT_ABOUT,
      certifications: DEFAULT_CERTIFICATIONS,
      experience: DEFAULT_EXPERIENCES,
      skills: [],
      projects: DEFAULT_PROJECTS,
    };
  }
}

export default async function Home() {
  const { about, certifications, experience, skills, projects } = await getPortfolioData();

  return (
    <div className="space-y-4">
      <HeroSection resumeUrl={about?.resumeUrl} />
      <CertificationsSection certificationsData={certifications} />
      <ExperienceSection experienceData={experience} />
      <ProjectSection projectsData={projects} />
      <SkillsSection skillsData={skills} />
      <ContactSection />
    </div>
  );
}
