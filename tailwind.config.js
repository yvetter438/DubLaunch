/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#FFFFFF',
          text: '#000000',
          muted: '#525252',
          subtle: '#737373',
          footer: '#0A0A0A',
        },
        uw: {
          purple: '#4B2E83',
          gold: '#B7A57A',
          light: '#F8F7F3',
        },
        primary: {
          50: '#f3f1ff',
          100: '#ede9ff',
          200: '#ddd6ff',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'text-reveal': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'text-reveal': 'text-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
