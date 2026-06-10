import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const siteUrl = 'https://www.virtvs.co';
const title = 'VIRTVS — Drop I: FORTITVDO';
const description = 'Enter early access for VIRTVS Drop I: FORTITVDO — limited heavyweight streetwear inspired by fortitude, discipline, and Roman virtue.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'VIRTVS',
  authors: [{ name: 'VIRTVS' }],
  creator: 'VIRTVS',
  publisher: 'VIRTVS',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'VIRTVS',
    title,
    description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VIRTVS Drop I: FORTITVDO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/wreath-logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-serif="cinzel" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
