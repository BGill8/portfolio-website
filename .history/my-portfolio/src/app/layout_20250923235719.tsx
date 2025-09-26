import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout'; // Import the new layout component

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Professional Portfolio',
  description: 'A portfolio of my web development projects and skills.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}