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
        background: 'var(--bg-primary)',
        surface: 'var(--bg-card)',
        'surface-elevated': 'var(--bg-elevated)',
        'surface-highlight': 'var(--bg-card-hover)',
        'surface-hover': 'var(--bg-card-hover)',
        'surface-header': 'var(--bg-header)',
        'border-subtle': 'rgba(255, 255, 255, 0.04)',
        'border-default': 'var(--border-default)',
        'border-strong': 'rgba(255, 255, 255, 0.11)',
        'border-primary': 'var(--border-primary)',
        'border-ai': 'var(--border-ai)',
        ai: 'var(--color-secondary)',
        'ai-glow': 'var(--color-secondary-glow)',
        'ai-dim': 'var(--color-secondary-dim)',
        primary: 'var(--color-primary)',
        'primary-glow': 'var(--color-primary-glow)',
        'primary-dim': 'var(--color-primary-dim)',
        secondary: 'var(--color-secondary)',
        'secondary-glow': 'var(--color-secondary-glow)',
        'secondary-dim': 'var(--color-secondary-dim)',
        accent: '#06b6d4',
        'accent-glow': '#67e8f9',
        'accent-dim': 'rgba(6, 182, 212, 0.10)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--danger)',
        wechat: '#07C160',
        dingtalk: '#1677FF',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        'text-disabled': 'var(--text-disabled)',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
      },
      borderRadius: {
        'card': '20px',
        'module': '14px',
        'badge': '999px',
      },
      boxShadow: {
        'glow-primary': '0 0 24px var(--shadow-primary)',
        'glow-secondary': '0 0 24px var(--shadow-secondary)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.18)',
        'panel': 'var(--shadow-card)',
        'card': 'var(--shadow-card)',
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
