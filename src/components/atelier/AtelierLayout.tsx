'use client';

import { Mark } from '@/components/mark/Mark';
import React, { useState } from 'react';
import { AtelierBackdrop } from './AtelierBackdrop';
import { IntroOverlay } from './IntroOverlay';

let introHasPlayed = false;

export function AtelierLayout({ children }: { children: React.ReactNode }) {
    const [introPlaying, setIntroPlaying] = useState(!introHasPlayed);

    function handleIntroDone() {
        introHasPlayed = true;
        window.scrollTo(0, 0);
        setIntroPlaying(false);
    }

    return (
        <>
            {!introHasPlayed && <IntroOverlay onDone={handleIntroDone} />}
            <div className="atelier">
            <AtelierBackdrop />
            <div
                className={introPlaying ? undefined : 'ate-content-revealed'}
                style={introPlaying ? { opacity: 0, pointerEvents: 'none' } : undefined}
            >

            <main>{children}</main>
            <footer className="ate-footer-wrap">
            <div className="ate-footer">
                <div className="ate-footer-top">
                    <div className="ate-footer-mark">
                        <Mark color="#E8201C" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="ate-footer-sign">
                        <h2><span className="ate-footer-word">ısmora<sup className="ate-footer-tm">™</sup></span></h2>
                        <span className="ate-footer-sub">TECHNOLOGIES LIMITED</span>
                    </div>
                </div>
                <div className="ate-footer-cols">
                    <div>
                        <span className="ate-num">Navigate</span>
                        <ul>
                            <li><a href="/">Index</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <span className="ate-num">Elsewhere</span>
                        <ul>
                            <li><a>LinkedIn →</a></li>
                        </ul>
                    </div>
                    <div className="ate-footer-meta">
                        <span className="ate-num">Document</span>
                        <p>© 2026 Ismora Technologies Limited. Built in Nigeria.</p>
                    </div>
                </div>
            </div>
            </footer>
            </div>
            </div>
        </>
    );
}
