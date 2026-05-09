'use client';

import { AtelierHero } from '@/components/atelier/AtelierHero';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import { FeatureSection } from '@/components/atelier/FeatureSection';
import { Reveal } from '@/components/atelier/Reveal';
import type { ApiService, ApiSiteConfig } from '@/lib/types';

interface Props {
    config: ApiSiteConfig | null;
    featuredServices: ApiService[];
}

export function HomeClient({ config, featuredServices }: Props) {
    return (
        <AtelierLayout>
            <main className="ate-home">
                <AtelierHero />

                {featuredServices.length > 0 && (
                    <section className="ate-work">
                        <Reveal>
                            <div className="ate-section-head">
                                <span className="ate-num">/ 03</span>
                                <span className="ate-section-title">Core Solutions</span>
                            </div>
                        </Reveal>
                        <div className="ate-work-list">
                            {featuredServices.map((s, i) => (
                                <Reveal key={s.id} delay={i * 100}>
                                    <a href={`/services/${s.slug}`} className="ate-work-row">
                                        <span className="ate-work-n">{String(i + 1).padStart(3, '0')}</span>
                                        <span className="ate-work-name">{s.name}</span>
                                        <span className="ate-work-kind">{s.category}</span>
                                        <span className="ate-work-desc">{s.tagline}</span>
                                        <span className="ate-work-arrow">→</span>
                                    </a>
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}

                <div className="ate-features">
                    <FeatureSection
                        num="01"
                        label="Infrastructure"
                        title={<>Hardware is<br />a feeling.</>}
                        body="The click of a latch. The hum before a turbine spins up. We design for the hands that work before dawn."
                        image="/images/hardware.png"
                        imageAlt="Hardware infrastructure"
                    />
                    <FeatureSection
                        num="02"
                        label="Software"
                        title={<>Software<br />should behave.</>}
                        body="It should do the thing, the first time, offline, when the WiFi is lying to you. Reliability is a love language."
                        image="/images/software.png"
                        imageAlt="Software systems"
                        reverse
                    />
                    <FeatureSection
                        num="03"
                        label="Insight"
                        title={<>Data that<br />shows its work.</>}
                        body="Dashboards you can argue with. Forecasts that explain themselves. Intelligence that earns its place in the room."
                        image="/images/forecast.png"
                        imageAlt="Data intelligence"
                    />
                </div>

                <section className="ate-big">
                    <Reveal>
                        <p className="ate-big-quote">
                            We don&apos;t chase trends — we find <em>unique approaches</em> to
                            the <span className="ate-big-chunk" style={{ padding: '0 0.2em', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}>hard problems</span> that actually matter.
                        </p>
                    </Reveal>
                </section>
            </main>
        </AtelierLayout>
    );
}
