import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF385C',
          50: '#FFF1F4',
          500: '#FF385C',
          600: '#E62E52',
          700: '#B02341',
        },
        ink: {
          DEFAULT: '#0B0F14',
          soft: '#1A2029',
          muted: '#8A94A6',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(11, 15, 20, 0.15)',
        glow: '0 0 40px -8px rgba(255, 56, 92, 0.35)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};
export default config;
