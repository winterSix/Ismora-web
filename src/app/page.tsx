import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { FeatureScroll } from '@/components/sections/FeatureScroll';
import { SelectedWorks } from '@/components/sections/SelectedWorks';
import { Faq } from '@/components/sections/Faq';
import { Cta } from '@/components/sections/Cta';
import { Footer } from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <main>
      {/* 1 — Nav + Hero */}
      <Hero />

      {/* 2 — About Us */}
      <About />

      {/* 3–5 — Insights / Infrastructure / Innovation (pinned cross-swap) */}
      <FeatureScroll />

      {/* 6 — Selected Works */}
      <SelectedWorks />

      {/* 7 — FAQ */}
      <Faq />

      {/* 8 — CTA */}
      <Cta />

      {/* 9 — Footer */}
      <Footer />
    </main>
  );
}
