/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#f8fafc',
        surface: '#ffffff',
        subtle: '#f1f5f9',
        hover: '#e2e8f0',
        navy: {
          DEFAULT: '#0f172a',
          dark: '#020617',
          light: '#1e293b',
        },
        accentBlue: {
          DEFAULT: '#1e40af',
          hover: '#1d4ed8',
        },
        brandBorder: {
          DEFAULT: '#cbd5e1',
          subtle: '#e2e8f0',
          strong: '#94a3b8',
        },
        brandText: {
          main: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
          inverse: '#ffffff',
        },
        safe: {
          bg: '#ecfdf5',
          text: '#065f46',
          border: '#a7f3d0',
          fill: '#10b981',
        },
        warn: {
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fde68a',
          fill: '#f59e0b',
        },
        danger: {
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fca5a5',
          fill: '#ef4444',
        }
      },
      fontFamily: {
        heading: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"SF Mono"', '"Cascadia Code"', '"Roboto Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
