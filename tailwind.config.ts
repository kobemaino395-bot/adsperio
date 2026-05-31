import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "zest" name retained for compatibility — now the indigo brand ramp
        zest: {
          50:  '#eef0ff',
          100: '#dcdcfd',
          200: '#b9b9f9', // primary-bg-subdued
          300: '#8f86fd',
          400: '#665efd', // primary-soft
          500: '#533afd', // primary
          600: '#4434d4', // primary-deep
          700: '#2e2b8c', // primary-press
          800: '#252574',
          900: '#1c1e54', // brand-dark-900
        },
        // "ink" tokens are the deep-navy text scale (never pure black)
        ink: {
          DEFAULT: '#0d253d',
          soft: '#273951',
          muted: '#64748d',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['var(--font-sans)', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'orb-float': 'orb-float 14s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 12s ease infinite',
      },
      keyframes: {
        'orb-float': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(40px,-30px) scale(1.08)' },
        },
        'gradient-shift': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;