'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Award, Check, Copy, ExternalLink, FileText, Terminal } from 'lucide-react';
import {
  CONTACT_EMAIL,
  CREDLY_PROFILE_URL,
  GITHUB_URL,
  LINKEDIN_URL,
} from '@/lib/constants';

interface HeroSectionProps {
  resumeUrl?: string;
}

const TERMINAL_COMMANDS: Record<string, string> = {
  curl: 'curl -fsSL https://brandongill.dev/api/bio | sh',
  npx: 'npx brandongill',
  python: 'pip install brandon-agent-framework',
  status: 'agent_status: ready // focus: autonomous_systems & mlops',
};

const HeroSection = ({ resumeUrl = '/resume.pdf' }: HeroSectionProps) => {
  const [activeTab, setActiveTab] = useState<'curl' | 'npx' | 'python' | 'status'>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(TERMINAL_COMMANDS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-6 pb-14 md:pt-12 md:pb-20 border-b border-[#2e2c2c]" id="about">
      {/* Top Technical Status Banner */}
      <div className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-[#8e8b8b] border border-[#2e2c2c] bg-[#171616] px-3 py-1 rounded-[3px]">
        <span className="text-[#cfcecd]">[*]</span>
        <span>M.S. Artificial Intelligence // Oregon State University</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Title, Bio, Terminal Utility */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
              Brandon Gill
            </h1>
            <p className="text-base sm:text-lg font-mono text-[#8e8b8b]">
              AI Systems Engineer &amp; Machine Learning Researcher
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#cfcecd] leading-relaxed max-w-xl font-sans">
            Graduate student at <strong className="text-white font-semibold">Oregon State University</strong> specializing in Machine Learning and Artificial Intelligence. Building scalable autonomous agent workflows, distributed LLM orchestration pipelines, and cloud-native infrastructure.
          </p>

          {/* Interactive Terminal Quick-Action Box (OpenCode Style) */}
          <div className="border border-[#2e2c2c] bg-[#171616] rounded-[4px] overflow-hidden max-w-xl">
            {/* Terminal Header & Tabs */}
            <div className="flex items-center justify-between border-b border-[#2e2c2c] bg-[#131111] px-2 py-1 font-mono text-xs">
              <div className="flex items-center space-x-1">
                {(['curl', 'npx', 'python', 'status'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 text-[11px] rounded-[3px] transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#1f1d1d] text-white font-semibold'
                        : 'text-[#8e8b8b] hover:text-[#cfcecd]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#656363] pr-2 hidden sm:inline">cli terminal</span>
            </div>

            {/* Command Display with Copy Action */}
            <div className="p-3.5 flex items-center justify-between font-mono text-xs text-[#cfcecd] bg-[#171616]">
              <div className="flex items-center space-x-2 overflow-x-auto select-all pr-2">
                <span className="text-[#8e8b8b] select-none">&gt;</span>
                <span className="text-[#ffffff] font-medium whitespace-nowrap">
                  {TERMINAL_COMMANDS[activeTab]}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1.5 text-[#8e8b8b] hover:text-white hover:bg-[#1f1d1d] border border-[#2e2c2c] rounded-[3px] transition-colors cursor-pointer"
                title="Copy command"
                aria-label="Copy command"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#03B000]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Clean Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
            <a
              href="#certifications"
              className="inline-flex items-center gap-2 bg-[#ffffff] hover:bg-[#e4e2e2] text-[#131111] font-semibold px-4 py-2 rounded-[3px] transition-colors"
            >
              <span>Certifications [3]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-[#1a1919] hover:bg-[#222020] text-white border border-[#3b3939] px-4 py-2 rounded-[3px] transition-colors"
            >
              <span>Projects</span>
            </a>

            <a
              href="/finance/dcf"
              className="inline-flex items-center gap-2 bg-[#1a1919] hover:bg-[#222020] text-[#cfcecd] border border-[#3b3939] px-4 py-2 rounded-[3px] transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-[#8e8b8b]" />
              <span>DCF Model</span>
            </a>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#8e8b8b] hover:text-white px-3 py-2 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume.pdf</span>
              </a>
            )}
          </div>

          {/* Connect Bar */}
          <div className="flex items-center space-x-3 pt-2 font-mono text-xs text-[#8e8b8b]">
            <span className="text-[#656363]">links:</span>
            <a href={CREDLY_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              credly
            </a>
            <span className="text-[#3b3939]">/</span>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              github
            </a>
            <span className="text-[#3b3939]">/</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              linkedin
            </a>
            <span className="text-[#3b3939]">/</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
              email
            </a>
          </div>
        </div>

        {/* Right Column: Engineering Spec Sheet Card */}
        <div className="lg:col-span-5">
          <div className="border border-[#2e2c2c] bg-[#171616] rounded-[4px] p-5 space-y-4">
            {/* Figure Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2e2c2c] font-mono text-xs">
              <span className="text-[#8e8b8b]">
                <strong className="text-white font-semibold">Fig 1.</strong> Specification
              </span>
              <span className="text-[11px] text-[#656363]">[AI/ML_CORE]</span>
            </div>

            {/* Profile Photo */}
            <div className="relative w-full h-44 rounded-[3px] overflow-hidden border border-[#2e2c2c] bg-[#131111]">
              <Image
                src="/headshot.jpeg"
                alt="Brandon Gill"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                priority
              />
            </div>

            {/* Technical Ledger Metadata */}
            <div className="divide-y divide-[#2e2c2c] font-mono text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-[#8e8b8b]">DEGREE</span>
                <span className="text-white font-medium">M.S. Computer Science (AI)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e8b8b]">INSTITUTION</span>
                <span className="text-[#cfcecd]">Oregon State University</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e8b8b]">FOCUS</span>
                <span className="text-[#cfcecd]">Autonomous Systems &amp; LLMs</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e8b8b]">CREDENTIALS</span>
                <span className="text-white">3 Verified (AWS &amp; GCP)</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-[#8e8b8b]">LOCATION</span>
                <span className="text-[#cfcecd]">Corvallis, Oregon</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#2e2c2c]">
              <a
                href={CREDLY_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-[#cfcecd] hover:text-white bg-[#1a1919] hover:bg-[#222020] border border-[#2e2c2c] rounded-[3px] transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-[#8e8b8b]" />
                <span>Verify on Credly [3 Badges]</span>
                <ExternalLink className="w-3 h-3 text-[#656363]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
