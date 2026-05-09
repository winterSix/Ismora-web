import React from 'react';
import { FoundryRail } from './FoundryRail';
import { FoundryStatusBar } from './FoundryStatusBar';
import { FoundryTopBar } from './FoundryTopBar';

export function FoundryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="foundry">
            <FoundryRail />
            <FoundryTopBar />
            <div className="fnd-content">
                {children}
            </div>
            <FoundryStatusBar />
        </div>
    );
}
