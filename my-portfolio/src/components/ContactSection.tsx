'use client';

import { useState } from 'react';
import { Award, Check, Copy, Send } from 'lucide-react';
import { BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';
import {
  CONTACT_EMAIL,
  CREDLY_PROFILE_URL,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
} from '@/lib/constants';

const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 md:py-24" id="contact">
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto border border-zinc-800 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to Opportunities & Collaborations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Get in Touch
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            I am always interested in discussing machine learning systems, research initiatives, AI engineering opportunities, and innovative software projects.
          </p>

          {/* Email Action & Copy Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:translate-y-[-1px]"
            >
              <Send className="w-4 h-4" />
              <span>Send Email</span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium px-5 py-3 rounded-xl border border-zinc-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>{CONTACT_EMAIL}</span>
                </>
              )}
            </button>
          </div>

          {/* Social Links Row */}
          <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
            <a
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-amber-400 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Credly Badges</span>
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <BsLinkedin className="w-4 h-4 text-blue-400" />
              <span>LinkedIn</span>
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <BsGithub className="w-4 h-4 text-zinc-300" />
              <span>GitHub</span>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-pink-400 transition-colors"
            >
              <BsInstagram className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <footer className="mt-16 text-center text-xs text-zinc-500 space-y-1">
        <p>© {new Date().getFullYear()} Brandon Gill. All rights reserved.</p>
        <p className="text-zinc-600">
          Master of Science in Artificial Intelligence • Oregon State University
        </p>
      </footer>
    </section>
  );
};

export default ContactSection;
