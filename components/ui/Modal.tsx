'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, LucideIcon } from 'lucide-react';

export type ModalColorScheme = 'rose' | 'violet' | 'green' | 'error' | 'accent' | 'gold';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
  zIndex?: number;
  colorScheme?: ModalColorScheme;
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full',
};

const schemeStyles: Record<ModalColorScheme, { border: string; shadow: string; glow: string }> = {
  rose: {
    border: 'color-mix(in srgb, var(--color-primary) 45%, transparent)',
    shadow: 'var(--shadow-card)',
    glow: 'var(--shadow-primary)',
  },
  violet: {
    border: 'color-mix(in srgb, var(--color-secondary) 45%, transparent)',
    shadow: 'var(--shadow-card)',
    glow: 'var(--shadow-secondary)',
  },
  green: {
    border: 'color-mix(in srgb, var(--success) 45%, transparent)',
    shadow: 'var(--shadow-card)',
    glow: 'color-mix(in srgb, var(--success) 22%, transparent)',
  },
  error: {
    border: 'color-mix(in srgb, var(--danger) 45%, transparent)',
    shadow: 'var(--shadow-card)',
    glow: 'color-mix(in srgb, var(--danger) 22%, transparent)',
  },
  accent: {
    border: 'color-mix(in srgb, var(--accent) 45%, transparent)',
    shadow: 'var(--shadow-card)',
    glow: 'color-mix(in srgb, var(--accent) 22%, transparent)',
  },
  gold: {
    border: 'color-mix(in srgb, var(--warning) 45%, transparent)',
    shadow: 'var(--shadow-card)',
    glow: 'color-mix(in srgb, var(--warning) 22%, transparent)',
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconClassName,
  children,
  footer,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
  className = '',
  zIndex = 100,
  colorScheme = 'rose',
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-background/85 absolute inset-0 backdrop-blur-md"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizeClasses[size]} pointer-events-auto flex max-h-[90vh] flex-col overflow-hidden rounded-card bg-surface-elevated shadow-card ${className}`}
            style={{
              border: `1px solid ${schemeStyles[colorScheme].border}`,
              boxShadow: schemeStyles[colorScheme].shadow,
            }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl"
              style={{ background: schemeStyles[colorScheme].glow }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full blur-3xl"
              style={{ background: schemeStyles[colorScheme].glow }}
            />
            <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-border-default p-6 pb-4">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div
                    className={`flex size-10 items-center justify-center rounded-module ${
                      iconClassName || 'bg-gradient-to-br from-primary to-primary-glow'
                    }`}
                  >
                    <Icon className="size-5 text-text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  {subtitle && <p className="text-xs text-text-tertiary">{subtitle}</p>}
                </div>
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="flex size-8 items-center justify-center rounded-module bg-surface-hover text-text-tertiary transition-all hover:bg-surface-highlight hover:text-text-primary"
                  aria-label="关闭"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="modal-scroll relative z-10 flex-1 overflow-y-auto p-6">{children}</div>

            {footer && (
              <div className="relative z-10 shrink-0 border-t border-border-default p-6 pt-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
