'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/button';

interface UnsavedPromptProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function UnsavedPrompt({ onCancel, onConfirm }: UnsavedPromptProps) {
  return (
    <Modal
      isOpen
      onClose={onCancel}
      title="有未保存的更改"
      subtitle="关闭后将丢失本次编辑内容"
      icon="AlertTriangle"
      iconClassName="bg-warning"
      size="sm"
      showClose={false}
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-text-tertiary transition-colors hover:text-text-primary"
            variant="ghost"
            size="md"
          >
            继续编辑
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-error/15 hover:bg-error/20 rounded-lg px-4 py-2 text-error transition-colors"
            variant="danger"
            size="md"
          >
            放弃更改
          </Button>
        </div>
      }
    >
      <p className="text-center text-sm text-text-tertiary">
        当前编辑内容尚未保存，确定要关闭弹窗吗？
      </p>
    </Modal>
  );
}
