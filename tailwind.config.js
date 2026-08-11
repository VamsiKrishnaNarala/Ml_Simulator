/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0B0D10',
          900: '#14171C',
          800: '#1B1F26',
          700: '#242A33',
          600: '#333B47',
          500: '#4A5463',
        },
        paper: '#F4F2EC',
        primary: {
          DEFAULT: '#6366F1',
          bright: '#818CF8',
        },
        amber: {
          DEFAULT: '#F5A623',
        },
        rose: {
          DEFAULT: '#FF6B7A',
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
        grid: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.15), 0 0 24px rgba(99,102,241,0.08)',
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
