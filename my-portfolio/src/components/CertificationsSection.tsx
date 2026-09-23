import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { SanityCertification } from '@/lib/types';
import { CREDLY_PROFILE_URL, DEFAULT_CERTIFICATIONS } from '@/lib/constants';

interface CertificationsSectionProps {
  certificationsData?: SanityCertification[];
}

const CertificationsSection = ({ certificationsData }: CertificationsSectionProps) => {
  const certifications = (certificationsData && certificationsData.length > 0)
    ? certificationsData
    : DEFAULT_CERTIFICATIONS;

  return (
    <section className="py-14 md:py-20 border-b border-[#2e2c2c]" id="certifications">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#8e8b8b]">
            <span className="text-white">[*]</span>
            <span>INDUSTRY_CREDENTIALS [3_VERIFIED]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Certifications &amp; Badges
          </h2>
          <p className="text-[#8e8b8b] text-xs sm:text-sm max-w-xl font-sans">
            Verified machine learning, artificial intelligence, and cloud engineering certifications issued via Credly.
          </p>
        </div>

        <a
          href={CREDLY_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-[3px] text-xs font-mono text-[#cfcecd] hover:text-white bg-[#1a1919] hover:bg-[#222020] border border-[#3b3939] transition-colors"
        >
          <span>Credly Profile [All]</span>
          <ExternalLink className="w-3 h-3 text-[#8e8b8b]" />
        </a>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert, index) => {
          let imageSrc = cert.localBadgeUrl || '/badges/aws-ml-engineer.png';
          if (cert.badgeImage && cert.badgeImage.asset) {
            try {
              imageSrc = urlFor(cert.badgeImage).url();
            } catch {
              if (cert.localBadgeUrl) imageSrc = cert.localBadgeUrl;
            }
          }

          const credlyUrl = cert.credlyUrl || CREDLY_PROFILE_URL;

          return (
            <div
              key={cert._id || cert.title}
              className="border border-[#2e2c2c] bg-[#171616] hover:bg-[#1c1b1b] hover:border-[#3b3939] p-5 rounded-[4px] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Badge Logo Container */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#131111] rounded-[3px] p-2 border border-[#2e2c2c] flex items-center justify-center">
                    <Image
                      src={imageSrc}
                      alt={`${cert.title} badge`}
                      width={68}
                      height={68}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0 font-mono">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-[#03B000] bg-[#03B000]/10 border border-[#03B000]/30 px-1.5 py-0.5 rounded-[2px]">
                        VERIFIED
                      </span>
                      <span className="text-[10px] text-[#656363]">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-white font-sans leading-snug line-clamp-2">
                      {cert.title}
                    </h3>

                    <p className="text-xs text-[#8e8b8b] mt-0.5">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {/* Dates & Validity */}
                {(cert.issueDate || cert.expiryDate) && (
                  <div className="flex flex-wrap items-center gap-x-4 text-xs font-mono text-[#8e8b8b] pt-3 pb-2 border-t border-[#2e2c2c]">
                    {cert.issueDate && (
                      <span>ISSUED: {cert.issueDate}</span>
                    )}
                    {cert.expiryDate && (
                      <span className="text-[#656363]">EXPIRES: {cert.expiryDate}</span>
                    )}
                  </div>
                )}

                {/* Skills/Domains */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono text-[#8e8b8b] bg-[#131111] border border-[#2e2c2c] px-1.5 py-0.5 rounded-[2px]"
                      >
                        [{skill}]
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Link */}
              <div className="mt-4 pt-3 border-t border-[#2e2c2c]">
                <a
                  href={credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#cfcecd] hover:text-white transition-colors"
                >
                  <span>Verify Credly Badge</span>
                  <ExternalLink className="w-3 h-3 text-[#8e8b8b]" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CertificationsSection;
