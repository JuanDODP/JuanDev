/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0B0F',
        surface: {
          DEFAULT: '#111318',
          elevated: '#161A24',
          overlay: '#1C2130',
        },
        accent: {
          DEFAULT: '#4F9EFF',
          hover: '#6FB3FF',
          dim: 'rgba(79,158,255,0.12)',
          border: 'rgba(79,158,255,0.25)',
        },
        'text-primary': '#E8EAF0',
        'text-secondary': '#8892A4',
        'text-muted': '#4A5568',
        success: '#34D399',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
