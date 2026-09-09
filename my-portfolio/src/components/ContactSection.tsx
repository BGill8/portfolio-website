'use client';

import { useState } from 'react';
import { Check, Copy, Send } from 'lucide-react';
import {
  CONTACT_EMAIL,
  CREDLY_PROFILE_URL,
  GITHUB_URL,
  LINKEDIN_URL,
} from '@/lib/constants';

const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-14 md:py-20" id="contact">
      <div className="border border-[#2e2c2c] bg-[#171616] rounded-[4px] p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8e8b8b]">
            <span className="text-white">[*]</span>
            <span>COMMUNICATIONS // DISCUSSIONS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Get in Touch
          </h2>

          <p className="text-xs sm:text-sm text-[#8e8b8b] font-sans leading-relaxed max-w-lg">
            Available for discussions regarding machine learning engineering, graduate research, agentic systems, and cloud infrastructure.
          </p>
        </div>

        {/* Technical Email Box */}
        <div className="border border-[#2e2c2c] bg-[#131111] rounded-[3px] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center space-x-2 text-[#cfcecd]">
            <span className="text-[#8e8b8b]">email:</span>
            <span className="text-white font-medium select-all">{CONTACT_EMAIL}</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1f1d1d] hover:bg-[#282626] text-[#cfcecd] hover:text-white border border-[#3b3939] rounded-[3px] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#03B000]" />
                  <span className="text-[#03B000]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#e4e2e2] text-[#131111] font-semibold rounded-[3px] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </a>
          </div>
        </div>

        {/* Ledger Links Row */}
        <div className="pt-4 border-t border-[#2e2c2c] flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#8e8b8b]">
          <div className="flex items-center space-x-4">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              [GitHub]
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              [LinkedIn]
            </a>
            <a href={CREDLY_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              [Credly_Badges]
            </a>
          </div>

          <span className="text-[11px] text-[#656363]">© 2026 Brandon Gill</span>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
