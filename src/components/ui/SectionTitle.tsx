import React from "react";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
    className?: string;
}

export function SectionTitle({ title, subtitle, align = "left", className = "" }: SectionTitleProps) {
    const alignments = {
        left: "text-left",
        center: "text-center mx-auto",
        right: "text-right ml-auto",
    };

    return (
        <div className={`mb-12 ${alignments[align]} ${className}`}>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
