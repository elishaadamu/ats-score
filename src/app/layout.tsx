import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ATS Max | Professional AI Resume & CV Optimizer',
  description: 'Boost your career with ATS Max. Our AI-powered tool extracts keywords from job descriptions and perfectly tailors your resume to achieve a 95%+ ATS score. Batch process multiple applications, generate custom cover letters, and dominate the job market.',
  keywords: ['ATS Optimizer', 'Resume Builder', 'CV Tailoring', 'Job Application Tool', 'AI Resume', 'Career Growth', 'ATS Score Checker'],
  authors: [{ name: 'ATS Max Team' }],
  openGraph: {
    title: 'ATS Max | Professional AI Resume & CV Optimizer',
    description: 'Stop guessing and start getting interviews. Tailor your resume to any job description in seconds with 95%+ ATS matching accuracy.',
    url: 'https://atsmax.ai',
    siteName: 'ATS Max',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ATS Max - AI Resume Optimizer Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS Max | AI Resume Optimizer',
    description: 'Get hired faster. Optimizing your resume for ATS tracking systems has never been easier.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
