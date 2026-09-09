'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { Award, FileText } from 'lucide-react';
import { CREDLY_PROFILE_URL, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';

interface NavbarProps {
  resumeUrl?: string;
}

const Navbar = ({ resumeUrl = '/resume.pdf' }: NavbarProps) => {
  const profileImages = [
    '/headshot.jpeg',
    '/red.JPG',
    '/stone.jpeg',
    '/mask.JPG',
    '/forehand.jpeg',
  ];

  const [imageIndex, setImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleImageClick = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
  };

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Certifications', href: '/#certifications', badge: '3' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Projects', href: '/#projects' },
    { label: 'DCF Model', href: '/finance/dcf' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2e2c2c] bg-[#131111]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Avatar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleImageClick}
            className="group relative w-8 h-8 rounded-[3px] overflow-hidden border border-[#3b3939] hover:border-[#8e8b8b] transition-colors focus:outline-none"
            title="Click to toggle profile picture"
            aria-label="Toggle profile picture"
          >
            <Image
              key={imageIndex}
              src={profileImages[imageIndex]}
              alt="Brandon Gill"
              width={32}
              height={32}
              className="object-cover w-full h-full"
              priority
            />
          </button>
          <div className="flex items-baseline space-x-2 font-mono">
            <Link
              href="/"
              className="text-xs font-bold tracking-wider text-white hover:text-zinc-300 transition-colors uppercase"
            >
              Brandon Gill
            </Link>
            <span className="hidden sm:inline text-[11px] text-[#8e8b8b]">
              [M.S. AI @ OSU]
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 font-mono text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2.5 py-1 text-[#8e8b8b] hover:text-white hover:bg-[#1f1d1d] rounded-[3px] transition-colors"
            >
              {link.label}
              {link.badge && (
                <span className="ml-1 text-[10px] text-[#656363]">[{link.badge}]</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2 font-mono text-xs">
          <a
            href={CREDLY_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#cfcecd] hover:text-white bg-[#1a1919] hover:bg-[#242222] border border-[#3b3939] px-2.5 py-1 rounded-[3px] transition-colors"
            title="View Credly Badges"
          >
            <Award className="w-3 h-3 text-[#cfcecd]" />
            <span>Badges [3]</span>
          </a>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-[#8e8b8b] hover:text-white px-2 py-1 transition-colors"
              title="Download Resume"
            >
              <FileText className="w-3 h-3" />
              <span>Resume</span>
            </a>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#8e8b8b] hover:text-white border border-[#3b3939] rounded-[3px] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#2e2c2c] bg-[#171616] px-4 py-3 space-y-2 font-mono text-xs">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 text-[#cfcecd] hover:text-white hover:bg-[#1f1d1d] rounded-[3px] transition-colors"
            >
              <span>{link.label}</span>
              {link.badge && <span className="ml-1 text-[#8e8b8b]">[{link.badge}]</span>}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#2e2c2c] flex items-center space-x-3 text-xs">
            <a
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#cfcecd] hover:text-white"
            >
              Credly [3 Badges]
            </a>
            <span className="text-[#3b3939]">|</span>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-[#8e8b8b] hover:text-white">
              GitHub
            </a>
            <span className="text-[#3b3939]">|</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-[#8e8b8b] hover:text-white">
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;