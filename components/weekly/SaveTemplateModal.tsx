'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import Input from '@/components/ui/input';

interface SaveTemplateModalProps {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  saving: boolean;
}

export function SaveTemplateModal({ onClose, onSave, saving }: SaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="保存为周计划模板"
      subtitle="将当前周计划保存为可复用的模板"
      icon="Save"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-text-tertiary transition-colors hover:text-text-secondary"
            variant="ghost"
            size="md"
          >
            取消
          </Button>
          <Button
            onClick={() => onSave(name, description)}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 font-semibold text-text-primary transition-all hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-secondary)_40%,transparent)] disabled:opacity-50"
            variant="secondary"
            size="md"
          >
            {saving ? (
              <Icon name="Loader" size="sm" animate="spin" />
            ) : (
              <Icon name="Save" size="sm" />
            )}
            保存
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-text-tertiary">模板名称</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：三年级上学期第 1 周"
            className="bg-surface-elevated"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-text-tertiary">备注说明（可选）</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简要描述模板适用场景"
            rows={3}
            resize="none"
            className="focus:border-primary/50 border-border-default bg-surface-elevated px-3 py-2 text-text-secondary"
          />
        </div>
      </div>
    </Modal>
  );
}
