'use client';

interface Props {
    kind: 'insight' | 'infrastructure' | 'innovation';
    active: boolean;
    any?: boolean;
}

export function Model3D({ kind, active, any: anyActive }: Props) {
    const className = `ate-3d ate-3d-${kind}${active ? ' is-active' : ''}${anyActive && !active ? ' is-away' : ''}`;

    if (kind === 'insight') {
        return (
            <div className={className}>
                <div className="ate-3d-stage">
                    <div className="ate-3d-ring r1" />
                    <div className="ate-3d-ring r2" />
                    <div className="ate-3d-ring r3" />
                    <div className="ate-3d-pupil" />
                </div>
            </div>
        );
    }

    if (kind === 'infrastructure') {
        return (
            <div className={className}>
                <div className="ate-3d-stage">
                    <div className="ate-3d-cube">
                        {(['front', 'back', 'left', 'right', 'top', 'bottom'] as const).map((f) => (
                            <div key={f} className={`ate-3d-face f-${f}`}>
                                <div className="ate-3d-face-grid" />
                            </div>
                        ))}
                    </div>
                    <div className="ate-3d-pedestal" />
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="ate-3d-stage">
                <div className="ate-3d-shard">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="ate-3d-shard-face" style={{ '--i': i } as React.CSSProperties} />
                    ))}
                </div>
                <div className="ate-3d-orbit">
                    {([{ deg: 0, size: 8 }, { deg: 220, size: 5 }]).map(({ deg, size }, i) => (
                        <div key={i} className="ate-3d-orbit-dot" style={{ '--deg': `${deg}deg`, '--dot-size': `${size}px` } as React.CSSProperties} />
                    ))}
                </div>
            </div>
        </div>
    );
}
