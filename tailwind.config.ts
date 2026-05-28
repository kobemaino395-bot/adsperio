import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        // "zest" name retained for compatibility — now the vermilion spark ramp
        zest: {
          50:  '#fff2ee',
          100: '#ffe0d6',
          200: '#ffc2af',
          300: '#ff5a2c', // primary accent — vermilion spark
          400: '#ec4318',
          500: '#c8351a',
          600: '#9c2913',
          700: '#74200f',
          800: '#5a190c',
          900: '#3d1108',
        },
        pine: {
          50:  '#e9f3ee',
          100: '#c9e3d6',
          300: '#4aa57f',
          500: '#146349',
          700: '#0d3a2b',
          900: '#0a2419',
        },
        ink: {
          DEFAULT: '#0a1410',
          soft: '#13201a',
          muted: '#5c6b62',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'spark-gradient':
          'radial-gradient(ellipse at top left, rgba(255,90,44,0.18), transparent 55%), radial-gradient(ellipse at bottom right, rgba(31,138,99,0.16), transparent 55%)',
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