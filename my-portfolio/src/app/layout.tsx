import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Brandon Gill | M.S. Artificial Intelligence @ Oregon State University',
  description:
    'Master of Science student in Artificial Intelligence at Oregon State University. AWS & GCP Certified Machine Learning and AI specialist.',
  keywords: [
    'Brandon Gill',
    'Oregon State University',
    'Artificial Intelligence',
    'Machine Learning Engineer',
    'AWS Certified Machine Learning Engineer',
    'AWS Certified AI Practitioner',
    'Google Cloud Generative AI Leader',
    'Computer Science',
    'Portfolio',
  ],
  authors: [{ name: 'Brandon Gill' }],
  creator: 'Brandon Gill',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brandongill.dev',
    title: 'Brandon Gill | M.S. Artificial Intelligence @ Oregon State University',
    description:
      'Master of Science student in Artificial Intelligence at Oregon State University. AWS & GCP Certified Machine Learning and AI specialist.',
    siteName: 'Brandon Gill Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brandon Gill | M.S. Artificial Intelligence @ Oregon State University',
    description:
      'Master of Science student in Artificial Intelligence at Oregon State University. AWS & GCP Certified Machine Learning and AI specialist.',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent blur-3xl opacity-70" />
            <div className="absolute top-[35%] -left-48 w-96 h-96 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute top-[65%] -right-48 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
          </div>

          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}