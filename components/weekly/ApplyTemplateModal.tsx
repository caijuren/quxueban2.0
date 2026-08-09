'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import { type WeeklyPlanTemplate } from '@/lib/storage.types';

interface ApplyTemplateModalProps {
  templates: WeeklyPlanTemplate[];
  onClose: () => void;
  onApply: (templateId: string, mode: 'merge' | 'replace') => void;
}

export function ApplyTemplateModal({ templates, onClose, onApply }: ApplyTemplateModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="套用周计划模板"
      subtitle="选择已有模板应用到当前周计划"
      icon="LayoutTemplate"
      size="lg"
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
            onClick={() => selectedId && onApply(selectedId, mode)}
            disabled={!selectedId}
            className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 font-semibold text-text-primary transition-all hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-secondary)_40%,transparent)] disabled:opacity-50"
            variant="secondary"
            size="md"
          >
            套用
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface-elevated p-1">
          <Button
            onClick={() => setMode('merge')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'merge'
                ? 'bg-secondary text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
            variant="ghost"
            size="sm"
          >
            合并到当前计划
          </Button>
          <Button
            onClick={() => setMode('replace')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'replace'
                ? 'bg-secondary text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
            variant="ghost"
            size="sm"
          >
            替换当前计划
          </Button>
        </div>

        {templates.length === 0 ? (
          <EmptyState scene="no-data" size="sm" />
        ) : (
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {templates.map((tpl) => (
              <Button
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  selectedId === tpl.id
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'border-border-subtle bg-surface-elevated hover:border-border-default'
                }`}
                variant="secondary"
                size="sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">{tpl.name}</span>
                  {selectedId === tpl.id && (
                    <Icon name="CircleCheck" size="sm" className="text-secondary" />
                  )}
                </div>
                {tpl.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-text-muted">{tpl.description}</p>
                )}
                <p className="mt-2 text-2xs text-text-tertiary">{tpl.tasks.length} 个任务</p>
              </Button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
