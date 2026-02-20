import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "glass";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pine-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-cinematic-primary hover:bg-pine-700 text-white shadow-lg shadow-pine-900/40",
        secondary: "bg-cinematic-surface border border-white/10 hover:border-white/30 text-white hover:bg-white/5",
        ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white",
        glass: "glass-card hover:bg-white/10 text-white border-white/20",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
