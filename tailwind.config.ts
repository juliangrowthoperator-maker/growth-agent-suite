import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                pine: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981', // main green ish
                    600: '#059669', // Pine green
                    700: '#047857', // Darker pine
                    800: '#065f46',
                    900: '#064e3b',
                    950: '#022c22',
                },
                cinematic: {
                    deep: '#010f14',      // Very dark blue/green for backgrounds
                    surface: '#03171f',   // Slightly lighter for cards/sections
                    primary: '#065f46',   // Pine green 800
                    light: '#34d399',     // Pine green 400
                    accent: '#d4af37',    // Soft gold
                    blue: '#0e7490',      // Cyan 700
                }
            },
            backgroundImage: {
                'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
                'glass-strong': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
                'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(6, 95, 70, 0.15) 0%, transparent 70%)',
                'hero-gradient': 'linear-gradient(to bottom, rgba(1, 15, 20, 0.2) 0%, #010f14 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                'glow': '0 0 20px rgba(52, 211, 153, 0.15)',
            }
        },
    },
    plugins: [],
};
export default config;
