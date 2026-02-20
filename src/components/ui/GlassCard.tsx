import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    strong?: boolean;
    glow?: boolean;
    className?: string;
}

export function GlassCard({ children, strong = false, glow = false, className = "", ...props }: GlassCardProps) {
    const baseClass = strong ? "glass-card-strong" : "glass-card";
    const glowClass = glow ? "shadow-glow" : "";

    return (
        <div
            className={`${baseClass} ${glowClass} rounded-2xl p-6 transition-all duration-300 hover:border-white/20 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
