export function AtelierBackdrop() {
    return (
        <>
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: -22,
                    bottom: 0,
                    backgroundColor: '#0A0A0A',
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(244, 241, 236, 0.28) 1.1px, transparent 1.6px)',
                    backgroundSize: '22px 22px',
                    backgroundPosition: '-11px -11px',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <div className="ate-backdrop" aria-hidden="true">
                <div className="ate-backdrop-glow" />
                <div className="ate-backdrop-vignette" />
            </div>
        </>
    );
}
