'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, LucideIcon } from 'lucide-react';

export type ModalColorScheme = 'rose' | 'violet' | 'green' | 'danger' | 'accent' | 'gold';

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

const schemeStyles: Record<
  ModalColorScheme,
  { border: string; shadow: string; glow: string }
> = {
  rose: {
    border: 'rgba(244,63,94,0.3)',
    shadow: '0 0 80px rgba(244,63,94,0.25), 0 0 120px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
    glow: 'rgba(244,63,94,0.15)',
  },
  violet: {
    border: 'rgba(139,92,246,0.3)',
    shadow: '0 0 80px rgba(139,92,246,0.25), 0 0 120px rgba(244,63,94,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
    glow: 'rgba(139,92,246,0.15)',
  },
  green: {
    border: 'rgba(7,193,96,0.3)',
    shadow: '0 0 60px rgba(7,193,96,0.2), 0 0 100px rgba(7,193,96,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
    glow: 'rgba(7,193,96,0.1)',
  },
  danger: {
    border: 'rgba(239,68,68,0.3)',
    shadow: '0 0 60px rgba(239,68,68,0.2), 0 0 100px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
    glow: 'rgba(239,68,68,0.1)',
  },
  accent: {
    border: 'rgba(6,182,212,0.3)',
    shadow: '0 0 60px rgba(6,182,212,0.2), 0 0 100px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
    glow: 'rgba(6,182,212,0.1)',
  },
  gold: {
    border: 'rgba(245,158,11,0.3)',
    shadow: '0 0 60px rgba(245,158,11,0.2), 0 0 100px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
    glow: 'rgba(245,158,11,0.1)',
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
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={closeOnBackdrop ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizeClasses[size]} max-h-[90vh] rounded-3xl flex flex-col overflow-hidden pointer-events-auto ${className}`}
            style={{
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
              border: `1px solid ${schemeStyles[colorScheme].border}`,
              boxShadow: schemeStyles[colorScheme].shadow,
            }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
              style={{ background: schemeStyles[colorScheme].glow }}
            />
            <div
              className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl"
              style={{ background: schemeStyles[colorScheme].glow }}
            />
            <div className="relative z-10 p-6 pb-4 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      iconClassName || 'bg-gradient-to-br from-primary to-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold font-display">{title}</h3>
                  {subtitle && (
                    <p className="text-xs text-slate-400">{subtitle}</p>
                  )}
                </div>
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="关闭"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-6 modal-scroll">
              {children}
            </div>

            {footer && (
              <div className="relative z-10 p-6 pt-4 border-t border-white/5 shrink-0">
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
