'use client';
import { AtelierLayout } from '@/components/atelier/AtelierLayout';
import { Reveal } from '@/components/atelier/Reveal';
import type { ApiPage, ApiTeamMember, ApiSiteConfig } from '@/lib/types';

interface Props { page: ApiPage | null; team: ApiTeamMember[]; config: ApiSiteConfig | null; }

export function AboutClient({ page, team, config }: Props) {
  return (
    <AtelierLayout>
      <main className="ate-page">
        <section className="ate-page-hero">
          <h1 className="ate-page-title">
            {page?.hero_headline ?? <>Built to <em>last.</em></>}
          </h1>
          <p className="ate-page-lede">
            {page?.hero_subtext ?? 'We are a software company that takes the long view — building systems designed to work today and hold up tomorrow.'}
          </p>
        </section>

        {(config?.offices?.length ?? 0) > 0 && (
          <section className="ate-story">
            {config!.offices.map((o, i) => (
              <Reveal key={i} delay={i * 60} className="ate-story-row">
                <span className="ate-story-year">{o.country}</span>
                <div>
                  <h3>{o.name}</h3>
                  <p>{o.address}</p>
                </div>
              </Reveal>
            ))}
          </section>
        )}

        {team.length > 0 && (
          <section className="ate-people">
            <Reveal>
              <div className="ate-section-head">
                <span className="ate-num">/ the team</span>
                <span className="ate-section-title">Who we are</span>
              </div>
            </Reveal>
            <div className="ate-people-grid">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={i * 30} className="ate-person">
                  <div className="ate-person-avatar">{m.name.substring(0, 2).toUpperCase()}</div>
                  <div className="ate-person-role">{m.role}</div>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>
    </AtelierLayout>
  );
}
