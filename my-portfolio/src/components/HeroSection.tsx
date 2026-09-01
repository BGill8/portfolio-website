import Image from 'next/image';
import { ArrowRight, Award, ExternalLink, FileText, Mail, Sparkles } from 'lucide-react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import {
  CONTACT_EMAIL,
  CREDLY_PROFILE_URL,
  GITHUB_URL,
  LINKEDIN_URL,
} from '@/lib/constants';

interface HeroSectionProps {
  resumeUrl?: string;
}

const HeroSection = ({ resumeUrl = '/resume.pdf' }: HeroSectionProps) => {
  return (
    <section className="pt-10 pb-16 md:pt-16 md:pb-24 border-b border-zinc-800/60" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-8 space-y-6 text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span>Master of Science in Artificial Intelligence • Oregon State University</span>
          </div>

          {/* Main Title */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
              Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">Brandon Gill</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-zinc-300">
              AI Engineer & Machine Learning Researcher
            </p>
          </div>

          {/* Concise Bio */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
            I am a <strong className="text-zinc-200 font-semibold">Master of Science student at Oregon State University majoring in Artificial Intelligence</strong>. My work focuses on building scalable machine learning systems, autonomous agentic workflows, generative AI architectures, and cloud-native solutions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#certifications"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:translate-y-[-1px]"
            >
              <Award className="w-4 h-4 text-indigo-200" />
              <span>View Certifications</span>
              <ArrowRight className="w-4 h-4 text-indigo-300" />
            </a>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium px-5 py-2.5 rounded-xl border border-zinc-700/60 transition-all hover:translate-y-[-1px]"
            >
              <span>Explore Projects</span>
            </a>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-300 hover:text-white font-medium px-4 py-2.5 rounded-xl border border-zinc-800 transition-all"
              >
                <FileText className="w-4 h-4 text-zinc-400" />
                <span>Resume</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            )}
          </div>

          {/* Social Links Row */}
          <div className="flex items-center gap-4 pt-4 text-zinc-400 text-sm">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Connect:</span>
            <a
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Credly</span>
            </a>
            <span className="text-zinc-700">•</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
            >
              <BsGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-zinc-700">•</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-blue-400 transition-colors"
            >
              <BsLinkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <span className="text-zinc-700">•</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-indigo-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Right Column: Profile Card & Quick Stats */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-2xl glass-panel p-6 border border-zinc-800/80 shadow-2xl relative">
            {/* Ambient Corner Accent */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden ring-4 ring-zinc-800/80 shadow-xl">
              <Image
                src="/headshot.jpeg"
                alt="Brandon Gill"
                fill
                sizes="128px"
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center space-y-1 mb-5">
              <h2 className="text-lg font-bold text-white">Brandon Gill</h2>
              <p className="text-xs text-indigo-400 font-medium">
                M.S. in Artificial Intelligence
              </p>
              <p className="text-xs text-zinc-400">Oregon State University</p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-zinc-800/80 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500">Focus:</span>
                <span className="font-medium text-zinc-200">ML & Agentic Systems</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500">Degree:</span>
                <span className="font-medium text-zinc-200">M.S. Computer Science</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500">Verified Credentials:</span>
                <span className="font-semibold text-amber-400 inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> 3 Badges
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500">Location:</span>
                <span className="font-medium text-zinc-200">Corvallis, OR</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-800/80">
              <a
                href={CREDLY_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verify Credly Profile</span>
                <ExternalLink className="w-3 h-3 text-amber-400/70" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
