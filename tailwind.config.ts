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
        background: '#0a0a12',
        surface: '#101018',
        'surface-light': '#161620',
        'surface-elevated': '#1c1c28',
        'surface-highlight': '#222230',
        'border-subtle': 'rgba(255, 255, 255, 0.06)',
        'border-default': 'rgba(255, 255, 255, 0.10)',
        'border-strong': 'rgba(255, 255, 255, 0.16)',
        'border-glow': 'rgba(255, 45, 106, 0.22)',
        primary: 'var(--color-primary)',
        'primary-glow': 'var(--color-primary-glow)',
        'primary-dim': 'var(--color-primary-dim)',
        secondary: 'var(--color-secondary)',
        'secondary-glow': 'var(--color-secondary-glow)',
        'secondary-dim': 'var(--color-secondary-dim)',
        neon: '#ff2d6a',
        'neon-glow': '#ff5c8a',
        'neon-dim': 'rgba(255, 45, 106, 0.12)',
        'neon-violet': '#8b5cf6',
        'neon-violet-glow': '#a78bfa',
        'neon-violet-dim': 'rgba(139, 92, 246, 0.12)',
        accent: '#ff5c8a',
        'accent-glow': '#ff8aa8',
        'accent-dim': 'rgba(255, 92, 138, 0.12)',
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#fb7185',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.88)',
        'text-tertiary': 'rgba(255, 255, 255, 0.72)',
        'text-muted': 'rgba(255, 255, 255, 0.58)',
      },
      boxShadow: {
        'glow-primary': '0 0 28px var(--shadow-primary)',
        'glow-secondary': '0 0 28px var(--shadow-secondary)',
        'glow-accent': '0 0 20px rgba(255, 92, 138, 0.18)',
        'glow-sm': '0 0 12px var(--shadow-primary)',
        'glow-lg': '0 0 48px var(--shadow-primary)',
        'neon': '0 0 32px rgba(255, 45, 106, 0.25), 0 0 64px rgba(255, 45, 106, 0.12)',
        'neon-violet': '0 0 32px rgba(139, 92, 246, 0.22), 0 0 64px rgba(139, 92, 246, 0.10)',
        'neon-strong': '0 0 40px rgba(255, 45, 106, 0.35), 0 0 80px rgba(255, 45, 106, 0.18)',
        'neon-violet-strong': '0 0 40px rgba(139, 92, 246, 0.30), 0 0 80px rgba(139, 92, 246, 0.15)',
        'panel': '0 12px 40px rgba(0, 0, 0, 0.45)',
        'panel-glow': '0 12px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 45, 106, 0.08)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        body: ['var(--font-body)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'line-flow': 'lineFlow 3s linear infinite',
        'scan': 'scan 4s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px var(--shadow-primary)' },
          '100%': { boxShadow: '0 0 40px color-mix(in srgb, var(--color-primary) 40%, transparent)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', filter: 'blur(0px)' },
          '50%': { opacity: '1', filter: 'blur(1px)' },
        },
        lineFlow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
