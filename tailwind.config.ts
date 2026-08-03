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
        background: '#050508',
        surface: '#0a0a0f',
        'surface-elevated': '#111118',
        'surface-highlight': '#171720',
        'surface-hover': '#1e1e28',
        'border-subtle': 'rgba(255, 255, 255, 0.04)',
        'border-default': 'rgba(255, 255, 255, 0.06)',
        'border-strong': 'rgba(255, 255, 255, 0.11)',
        primary: 'var(--color-primary)',
        'primary-glow': 'var(--color-primary-glow)',
        'primary-dim': 'var(--color-primary-dim)',
        secondary: 'var(--color-secondary)',
        'secondary-glow': 'var(--color-secondary-glow)',
        'secondary-dim': 'var(--color-secondary-dim)',
        accent: '#06b6d4',
        'accent-glow': '#67e8f9',
        'accent-dim': 'rgba(6, 182, 212, 0.10)',
        success: '#22c55e',
        warning: '#d97706',
        error: '#ef4444',
        wechat: '#07C160',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.70)',
        'text-tertiary': 'rgba(255, 255, 255, 0.46)',
        'text-muted': 'rgba(255, 255, 255, 0.30)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
      },
      boxShadow: {
        'glow-primary': '0 0 24px var(--shadow-primary)',
        'glow-secondary': '0 0 24px var(--shadow-secondary)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.18)',
        'panel': '0 8px 32px rgba(0, 0, 0, 0.4)',
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
          '0%': { boxShadow: '0 0 16px var(--shadow-primary)' },
          '100%': { boxShadow: '0 0 32px color-mix(in srgb, var(--color-primary) 30%, transparent)' },
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
