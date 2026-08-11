/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#FFFFFF',
          900: '#F8FAFC',
          800: '#F1F5F9',
          700: '#E2E8F0',
          600: '#CBD5E1',
          500: '#64748B',
          400: '#94A3B8',
        },
        paper: '#0F172A',
        primary: {
          DEFAULT: '#2563EB',
          bright: '#3B82F6',
        },
        amber: {
          DEFAULT: '#D97706',
        },
        rose: {
          DEFAULT: '#E11D48',
        },
        blue: {
          class: '#5B8DEF',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(37,99,235,0.15), 0 0 24px rgba(37,99,235,0.08)',
      },
      keyframes: {
        dash: {
          to: { strokeDashoffset: '0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        dash: 'dash 1.2s ease-out forwards',
        floaty: 'floaty 4s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
