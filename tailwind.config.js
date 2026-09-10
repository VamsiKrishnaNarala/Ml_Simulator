/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'rgb(var(--brand-navy) / <alpha-value>)',
          navy: 'rgb(var(--brand-navy) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
        },
        ai: {
          DEFAULT: 'rgb(var(--ai) / <alpha-value>)',
          hover: 'rgb(var(--ai-hover) / <alpha-value>)',
          light: 'rgb(var(--ai-light) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          secondary: 'rgb(var(--surface-secondary) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
          focus: 'rgb(var(--border-focus) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        supervised: 'rgb(var(--supervised) / <alpha-value>)',
        unsupervised: 'rgb(var(--unsupervised) / <alpha-value>)',
        'semi-supervised': 'rgb(var(--semi-supervised) / <alpha-value>)',
        reinforcement: 'rgb(var(--reinforcement) / <alpha-value>)',
        chart: {
          blue: 'rgb(var(--chart-blue) / <alpha-value>)',
          teal: 'rgb(var(--chart-teal) / <alpha-value>)',
          purple: 'rgb(var(--chart-purple) / <alpha-value>)',
          orange: 'rgb(var(--chart-orange) / <alpha-value>)',
          red: 'rgb(var(--chart-red) / <alpha-value>)',
          grid: 'rgb(var(--chart-grid) / <alpha-value>)',
          axes: 'rgb(var(--chart-axes) / <alpha-value>)',
        },
      },
      textColor: {
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        brand: 'rgb(var(--brand-navy) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
      },
      backgroundColor: {
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-secondary': 'rgb(var(--surface-secondary) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--ai) / <alpha-value>)',
      },
      ringColor: {
        DEFAULT: 'rgb(var(--ring) / <alpha-value>)',
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
        glow: '0 0 0 1px rgba(37,99,235,0.12), 0 8px 24px rgba(15,59,101,0.06)',
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
