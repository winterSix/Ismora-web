import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { PersistentNav } from '@/components/atelier/PersistentNav';
import { api } from '@/lib/api';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await api.config();
    return {
      title: {
        default: config.default_seo?.title ?? 'Ismora Technologies',
        template: `%s — ${config.company_name}`,
      },
      description: config.default_seo?.description ?? 'Enterprise data solutions',
      icons: {
        icon: '/images/icon-red.jpg',
        apple: '/images/icon-red.jpg',
      },
      openGraph: {
        images: [{ url: '/images/combo-red.jpg' }],
      },
    };
  } catch {
    return {
      title: 'Ismora Technologies',
      description: 'Enterprise data solutions',
      icons: { icon: '/images/icon-red.jpg' },
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <PersistentNav />
        {children}
      </body>
    </html>
  );
}
