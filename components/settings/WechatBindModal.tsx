'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, QrCode, MessageCircle } from 'lucide-react';

interface WechatBindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WechatBindModal({
  isOpen,
  onClose,
}: WechatBindModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden flex flex-col max-h-[85vh]"
            style={{
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
              border: '1px solid rgba(7, 193, 96, 0.3)',
              boxShadow: '0 0 60px rgba(7, 193, 96, 0.15)',
            }}
          >
            <div className="p-6 border-b border-black/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#07C160]/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#07C160]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">微信绑定</h3>
                  <p className="text-xs text-slate-600">绑定后支持微信提醒与一键登录</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center text-slate-600 hover:text-text-primary hover:bg-black/10 transition-colors"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto modal-scroll text-center">
              <div className="aspect-square max-w-[200px] mx-auto rounded-2xl bg-white flex items-center justify-center mb-5">
                <div className="text-center p-6">
                  <QrCode className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <span className="text-sm text-slate-600">微信扫码绑定</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                正式版上线后将支持微信扫码一键绑定，当前请使用账号密码登录。
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#07C160] text-text-primary text-sm font-semibold hover:shadow-[0_0_20px_rgba(7,193,96,0.25)] transition-all"
              >
                知道了
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
