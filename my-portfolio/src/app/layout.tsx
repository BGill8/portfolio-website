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
  themeColor: '#131111',
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
      <body className="min-h-screen bg-[#131111] text-[#cfcecd] antialiased selection:bg-[#3b3939] selection:text-white">
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}