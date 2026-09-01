'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';
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
    { label: 'Certifications', href: '/#certifications' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Projects', href: '/#projects' },
    { label: 'DCF Model', href: '/finance/dcf' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Interactive Avatar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleImageClick}
            className="group relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500/30 hover:ring-indigo-500 transition-all duration-300 focus:outline-none focus:ring-offset-2 focus:ring-offset-zinc-950"
            title="Click to toggle profile picture"
            aria-label="Toggle profile picture"
          >
            <Image
              key={imageIndex}
              src={profileImages[imageIndex]}
              alt="Brandon Gill profile"
              width={40}
              height={40}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              priority
            />
          </button>
          <div className="flex flex-col">
            <Link
              href="/"
              className="text-base font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors"
            >
              Brandon Gill
            </Link>
            <span className="text-xs text-zinc-400 font-medium">
              M.S. AI @ Oregon State
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons & Socials */}
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href={CREDLY_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-full transition-all"
            title="View Credly Badges"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Credly Badges</span>
          </a>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-100 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
            aria-label="GitHub Profile"
          >
            <BsGithub className="w-4 h-4" />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-100 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <BsLinkedin className="w-4 h-4" />
          </a>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-500/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <a
              href={CREDLY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Credly Badges</span>
            </a>
            <div className="flex items-center space-x-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white p-1"
                aria-label="GitHub Profile"
              >
                <BsGithub className="w-4 h-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white p-1"
                aria-label="LinkedIn Profile"
              >
                <BsLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;