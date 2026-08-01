'use client';

import { QrCode, MessageCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface WechatBindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WechatBindModal({
  isOpen,
  onClose,
}: WechatBindModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="微信绑定"
      subtitle="绑定后支持微信提醒与一键登录"
      icon={MessageCircle}
      iconClassName="bg-[#07C160]/20 text-[#07C160]"
      size="sm"
      colorScheme="green"
    >
      <div className="text-center">
        <div className="aspect-square max-w-[200px] mx-auto rounded-2xl bg-white flex items-center justify-center mb-5">
          <div className="text-center p-6">
            <QrCode className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <span className="text-sm text-text-muted">微信扫码绑定</span>
          </div>
        </div>
        <p className="text-sm text-text-tertiary mb-6">
          正式版上线后将支持微信扫码一键绑定，当前请使用账号密码登录。
        </p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#07C160] text-white text-sm font-semibold transition-all"
        >
          知道了
        </button>
      </div>
    </Modal>
  );
}
