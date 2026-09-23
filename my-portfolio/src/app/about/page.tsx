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
    <div className="py-8 md:py-16 max-w-4xl mx-auto space-y-8 px-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-xs text-[#8e8b8b] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>&lt;- return / index</span>
      </Link>

      <div className="border border-[#2e2c2c] bg-[#171616] rounded-[4px] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="relative w-32 h-32 rounded-[3px] overflow-hidden border border-[#2e2c2c] flex-shrink-0">
            <Image
              src="/headshot.jpeg"
              alt="Photo of Brandon Gill"
              fill
              sizes="128px"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
              priority
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-xs text-[#8e8b8b] bg-[#131111] border border-[#2e2c2c]">
              <span>[*] Graduate Student // Oregon State University</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono uppercase tracking-tight">
              Brandon Gill
            </h1>
            <p className="text-xs font-mono text-[#8e8b8b]">
              Master of Science in Artificial Intelligence
            </p>
          </div>
        </div>

        <div className="space-y-4 text-[#cfcecd] leading-relaxed text-sm border-t border-[#2e2c2c] pt-6 font-sans">
          <p>
            I am a <strong className="text-white font-semibold">Master of Science student at Oregon State University majoring in Artificial Intelligence</strong>. My academic and technical journey centers around building advanced machine learning models, autonomous multi-agent architectures, and resilient cloud infrastructures.
          </p>
          <p>
            Holding industry certifications from Amazon Web Services (including <em className="text-white not-italic font-mono text-xs">[AWS Certified Machine Learning Engineer – Associate]</em> and <em className="text-white not-italic font-mono text-xs">[AWS Certified AI Practitioner]</em>) and Google Cloud (<em className="text-white not-italic font-mono text-xs">[Generative AI Leader]</em>), I combine theoretical foundations with practical engineering rigor.
          </p>
          <p>
            When I am not training models or architecting backend services, I enjoy contributing to open-source software, exploring cutting-edge generative AI research, and collaborating with cross-functional teams to build deterministic, high-throughput systems.
          </p>
        </div>

        <div className="pt-6 border-t border-[#2e2c2c] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-[#e1dfdd] text-[#131111] font-mono font-semibold px-3 py-1.5 rounded-[2px] text-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#131111] hover:bg-[#1a1919] text-[#cfcecd] hover:text-white font-mono px-3 py-1.5 rounded-[2px] text-xs border border-[#2e2c2c] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          </div>

          <div className="flex items-center gap-3 text-[#8e8b8b]">
            <a
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-[2px] border border-[#2e2c2c] bg-[#131111] hover:text-white transition-colors"
              title="Credly"
            >
              <Award className="w-3.5 h-3.5" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-[2px] border border-[#2e2c2c] bg-[#131111] hover:text-white transition-colors"
              title="GitHub"
            >
              <BsGithub className="w-3.5 h-3.5" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-[2px] border border-[#2e2c2c] bg-[#131111] hover:text-white transition-colors"
              title="LinkedIn"
            >
              <BsLinkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}