import Image from 'next/image';
import { Award, CheckCircle2, Calendar, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { SanityCertification } from '@/lib/types';
import { CREDLY_PROFILE_URL, DEFAULT_CERTIFICATIONS } from '@/lib/constants';

interface CertificationsSectionProps {
  certificationsData?: SanityCertification[];
}

const CertificationsSection = ({ certificationsData }: CertificationsSectionProps) => {
  // Use CMS data if provided and non-empty, otherwise use comprehensive default Credly certifications
  const certifications = (certificationsData && certificationsData.length > 0)
    ? certificationsData
    : DEFAULT_CERTIFICATIONS;

  return (
    <section className="py-16 md:py-24 border-b border-zinc-800/60" id="certifications">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Certifications & Badges
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Industry-recognized machine learning, artificial intelligence, and cloud certifications earned and verified via Credly.
          </p>
        </div>

        <a
          href={CREDLY_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-sm group"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>View All on Credly Profile</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400/80" />
        </a>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert) => {
          // Resolve image source: either Sanity image asset or local badge PNG fallback
          let imageSrc = cert.localBadgeUrl || '/badges/aws-ml-engineer.png';
          if (cert.badgeImage && cert.badgeImage.asset) {
            try {
              imageSrc = urlFor(cert.badgeImage).url();
            } catch {
              // Fallback to local image
              if (cert.localBadgeUrl) imageSrc = cert.localBadgeUrl;
            }
          }

          const credlyUrl = cert.credlyUrl || CREDLY_PROFILE_URL;

          return (
            <div
              key={cert._id || cert.title}
              className="glass-panel-glow rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Badge Logo Container */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-zinc-900/90 rounded-2xl p-2.5 border border-zinc-700/60 flex items-center justify-center group-hover:border-indigo-500/50 transition-all">
                    <Image
                      src={imageSrc}
                      alt={`${cert.title} badge logo`}
                      width={84}
                      height={84}
                      className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Issuer */}
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md mb-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-medium text-zinc-300 mt-1">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {/* Dates & Validity */}
                {(cert.issueDate || cert.expiryDate) && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mb-3.5 pt-2 border-t border-zinc-800/60">
                    {cert.issueDate && (
                      <span className="inline-flex items-center gap-1 text-zinc-400">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>Issued: <strong className="text-zinc-300 font-medium">{cert.issueDate}</strong></span>
                      </span>
                    )}
                    {cert.expiryDate && (
                      <span className="text-zinc-500">
                        Expires: <strong className="text-zinc-400 font-medium">{cert.expiryDate}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* Description */}
                {cert.description && (
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                    {cert.description}
                  </p>
                )}

                {/* Skills Chips */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/50 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Action: Credly Link */}
              <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Credly Authenticated
                </span>

                <a
                  href={credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:translate-x-0.5"
                >
                  <span>Verify on Credly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Credly Profile Highlight Banner */}
      <div className="mt-8 p-6 rounded-2xl glass-panel border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              Want to see all verified certifications and skills?
            </h4>
            <p className="text-xs text-zinc-400">
              View official credentials, issuing metadata, and skill taxonomy on Credly.
            </p>
          </div>
        </div>

        <a
          href={CREDLY_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors flex-shrink-0"
        >
          <span>Open Credly Badges</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};

export default CertificationsSection;
