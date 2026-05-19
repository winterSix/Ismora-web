import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { FeatureSection } from '@/components/sections/FeatureSection';
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

      {/* 3 — Insights */}
      <FeatureSection
        id="insights"
        tag="Insights"
        title="Data that shows its work"
        paragraph="Numbers without context are noise. We build the dashboards, reports, and analytics layers that let leaders see what's actually happening in their business and defend the decisions they make from it. Real-time when it has to be. Audit-grade when it counts."
        items={[
          'Operational dashboards for finance, sales, and service teams',
          'Decision-support tools tied to live transactional data',
          "Custom analytics for the questions off-the-shelf tools won't answer",
        ]}
        image="/images/orb.png"
        imageAlt="Insights"
        imageSide="right"
      />

      {/* 4 — Infrastructure */}
      <FeatureSection
        id="infrastructure"
        tag="Infrastructure"
        title="The systems beneath the business"
        paragraph="The unglamorous middle layer is where most software projects fail. We build the platforms, integrations, and connected systems that have to work, every transaction, every shift, every audit. Web, mobile, backend, payments, identity, and the hardware that ties it all to the physical world."
        items={[
          'Multi-tenant SaaS platforms with role-based access and tenant isolation',
          'Mobile applications built offline-first for Nigerian network realities',
          'Payment, wallet, KYC, and verification integrations',
        ]}
        image="/images/cube.png"
        imageAlt="Infrastructure"
        imageSide="left"
      />

      {/* 5 — Innovation */}
      <FeatureSection
        id="innovation"
        tag="Innovation"
        title="Built for here, not borrowed from elsewhere"
        paragraph="The best software for Nigerian businesses isn't a copy of what works in San Francisco. It assumes patchy networks, accounts for regulatory weight, respects how teams actually work, and stays online when the WiFi is flying. We build for the conditions our clients live in, not the ones a foreign blog post imagines."
        items={[
          'Hardware-software integration designed for African supply chains and operating environments',
          'NDPR-compliant data handling baked in from day one',
          'Multi-language and multi-currency support where it matters',
        ]}
        image="/images/swirl.png"
        imageAlt="Innovation"
        imageSide="right"
      />

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
