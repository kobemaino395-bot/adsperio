import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        zest: {
          50:  '#f7ffd9',
          100: '#ecffa8',
          200: '#dcff6b',
          300: '#c5f82a', // primary accent — citrus lime
          400: '#a9db14',
          500: '#86ae0f',
          600: '#667f12',
          700: '#4e6114',
          800: '#394613',
          900: '#252e0c',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#171717',
          muted: '#555555',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'zest-gradient':
          'radial-gradient(ellipse at top left, rgba(197,248,42,0.35), transparent 50%), radial-gradient(ellipse at bottom right, rgba(255,138,0,0.25), transparent 50%)',
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