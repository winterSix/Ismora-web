import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

// Headlines + UI use Space Grotesk (Light 300 for display, Bold 700 for pills).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ismora — We build the platforms African businesses depend on',
  description:
    'Ismora is a Lagos product engineering studio. We design and build the software systems, integrated infrastructure, and data tools that serious institutions rely on to operate.',
  icons: { icon: '/ismora-logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        {/* Satoshi (body copy) — Fontshare, not on Google Fonts */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
