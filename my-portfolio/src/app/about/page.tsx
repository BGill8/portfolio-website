import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Award, FileText, Mail } from 'lucide-react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
import {
  CONTACT_EMAIL,
  CREDLY_PROFILE_URL,
  GITHUB_URL,
  LINKEDIN_URL,
} from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16 max-w-4xl mx-auto space-y-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-zinc-800 space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden ring-4 ring-zinc-800 flex-shrink-0 shadow-xl">
            <Image
              src="/headshot.jpeg"
              alt="Photo of Brandon Gill"
              fill
              sizes="144px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <span>Graduate Student • Oregon State University</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Brandon Gill
            </h1>
            <p className="text-base text-zinc-300 font-medium">
              Master of Science in Artificial Intelligence
            </p>
          </div>
        </div>

        <div className="space-y-4 text-zinc-300 leading-relaxed text-base border-t border-zinc-800 pt-6">
          <p>
            I am a <strong className="text-white">Master of Science student at Oregon State University majoring in Artificial Intelligence</strong>. My academic and technical journey centers around building advanced machine learning models, autonomous multi-agent architectures, and resilient cloud infrastructures.
          </p>
          <p>
            Holding industry certifications from Amazon Web Services (including <em>AWS Certified Machine Learning Engineer – Associate</em> and <em>AWS Certified AI Practitioner</em>) and Google Cloud (<em>Generative AI Leader</em>), I combine deep theoretical foundations with practical engineering rigor.
          </p>
          <p>
            When I am not training models or architecting backend services, I enjoy contributing to open-source software, exploring cutting-edge generative AI research, and collaborating with cross-functional teams to bring impactful ideas to life.
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-md transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Me</span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium px-4 py-2 rounded-xl text-xs border border-zinc-800 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              title="Credly"
            >
              <Award className="w-4 h-4" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              title="GitHub"
            >
              <BsGithub className="w-4 h-4" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
              title="LinkedIn"
            >
              <BsLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}