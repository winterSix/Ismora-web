'use client';

const SECTIONS = [
  'Introduction',
  'About Us',
  'Services',
  'Our Works',
  'Meet the Team',
  'Contact Us',
];

interface SidebarNavProps {
  activeSection: number;
  onNavigate: (index: number) => void;
}

export function SidebarNav({ activeSection, onNavigate }: SidebarNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        left: 46,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: 50,
      }}
    >
      {/* Vertical line */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 4,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(255,255,255,0.25)',
        }}
      />

      {SECTIONS.map((label, i) => {
        const isActive = i === activeSection;
        const isDisabled = i > 2;
        return (
          <button
            key={label}
            onClick={() => !isDisabled && onNavigate(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: isDisabled ? 'default' : 'pointer',
              opacity: isDisabled ? 0.4 : 1,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isActive ? '#f0000c' : '#ffffff',
                flexShrink: 0,
                position: 'relative',
                zIndex: 1,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: isActive ? 500 : 300,
                fontSize: isActive ? 16 : 14,
                color: isActive ? '#f0000c' : '#ffffff',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
