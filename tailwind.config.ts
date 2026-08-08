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
        // Backgrounds
        background: 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-header': 'var(--bg-header)',
        'bg-card-hover': 'var(--bg-card-hover)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-disabled': 'var(--bg-disabled)',
        'bg-overlay': 'var(--bg-overlay)',

        // Surfaces
        surface: 'var(--bg-card)',
        'surface-elevated': 'var(--bg-elevated)',
        'surface-highlight': 'var(--bg-card-hover)',
        'surface-hover': 'var(--bg-card-hover)',
        'surface-header': 'var(--bg-header)',

        // Brand
        primary: 'var(--color-primary)',
        'primary-glow': 'var(--color-primary-glow)',
        'primary-dim': 'var(--color-primary-dim)',
        secondary: 'var(--color-secondary)',
        'secondary-glow': 'var(--color-secondary-glow)',
        'secondary-dim': 'var(--color-secondary-dim)',

        // AI (alias to secondary for backwards compatibility)
        ai: 'var(--color-secondary)',
        'ai-glow': 'var(--color-secondary-glow)',
        'ai-dim': 'var(--color-secondary-dim)',

        // Status
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--danger)',
        info: 'var(--info)',

        // Text
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        'text-disabled': 'var(--text-disabled)',
        'text-inverse': 'var(--text-inverse)',

        // Inverse (text-on-brand / dot-on-brand)
        inverse: 'var(--text-inverse)',

        // Borders
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        'border-primary': 'var(--border-primary)',
        'border-ai': 'var(--border-ai)',

        // Static brand colors (not part of theme switching)
        accent: '#06b6d4',
        'accent-glow': '#67e8f9',
        'accent-dim': 'rgba(6, 182, 212, 0.10)',
        wechat: '#07C160',
        dingtalk: '#1677FF',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-xs)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-sm)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-base)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-lg)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-xl)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-2xl)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-3xl)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-4xl)' }],
      },
      fontWeight: {
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        card: 'var(--radius-card)',
        module: 'var(--radius-module)',
        badge: '999px',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        card: 'var(--shadow-card)',
        panel: 'var(--shadow-card)',
        'glow-primary': '0 0 24px var(--shadow-primary)',
        'glow-secondary': '0 0 24px var(--shadow-secondary)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.18)',
        'glass-subtle': 'inset 0 1px 0 0 var(--glass-highlight), 0 4px 12px -2px var(--glass-shadow-color)',
        'glass': 'inset 0 1px 0 0 var(--glass-highlight), 0 8px 24px -4px var(--glass-shadow-color)',
        'glass-strong': 'inset 0 1px 0 0 var(--glass-highlight), 0 16px 40px -8px var(--glass-shadow-color)',
        'glass-hover': 'inset 0 1px 0 0 var(--glass-highlight), 0 24px 48px -8px var(--glass-shadow-color)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        body: ['var(--font-body)', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'monospace'],
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      backdropBlur: {
        'glass-subtle': 'var(--glass-blur-subtle)',
        'glass': 'var(--glass-blur-default)',
        'glass-strong': 'var(--glass-blur-strong)',
      },
      backgroundColor: {
        'glass-subtle': 'var(--glass-bg-subtle)',
        'glass': 'var(--glass-bg-default)',
        'glass-strong': 'var(--glass-bg-strong)',
      },
      borderColor: {
        'glass-subtle': 'var(--glass-border-subtle)',
        'glass': 'var(--glass-border-default)',
        'glass-strong': 'var(--glass-border-strong)',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        header: 'var(--z-header)',
        sidebar: 'var(--z-sidebar)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        'line-flow': 'lineFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 16px var(--shadow-primary)' },
          '100%': {
            boxShadow:
              '0 0 32px color-mix(in srgb, var(--color-primary) 30%, transparent)',
          },
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
