import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#08080c',
        surface: '#0f0f16',
        'surface-light': '#161622',
        primary: '#ff2d6a',
        'primary-glow': '#ff5c8a',
        secondary: '#8b5cf6',
        'secondary-glow': '#a78bfa',
        accent: '#06b6d4',
        'accent-glow': '#67e8f9',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        display: ['var(--font-display)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        body: ['var(--font-body)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'line-flow': 'lineFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(244, 63, 94, 0.6)' },
        },
        lineFlow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
