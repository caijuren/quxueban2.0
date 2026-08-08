'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import ChildModal from '@/components/dashboard/ChildModal';
import { Child, gradeLabel, gradeToStage, educationSystemLabel } from '@/lib/children';
import { getRouteById } from '@/lib/plans';
import SettingsSection from './SettingsSection';

export default function ChildrenSection() {
  const { children, currentChildId, setCurrentChildId } = useChildren();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingChild(null);
    setModalOpen(true);
  };

  const handleSetDefault = (id: string) => {
    setCurrentChildId(id);
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="孩子管理" description="管理孩子的学习档案">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {children.map((child) => (
            <div
              key={child.id}
              className="relative rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-all hover:border-border-default"
            >
              {currentChildId === child.id && (
                <div className="bg-primary/10 absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs text-primary">
                  <Icon name="Star" size="xs" />
                  默认
                </div>
              )}
              <div className="mb-4 flex items-start gap-3">
                <ChildAvatar child={child} size="xl" shape="rounded" />
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-bold text-text-primary">
                    {child.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {gradeLabel(child.grade, child.educationSystem)} ·{' '}
                    {gradeToStage(child.grade, child.educationSystem)} ·{' '}
                    {educationSystemLabel(child.educationSystem)}
                  </p>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Icon name="School" size="xs" className="text-text-muted" />
                  <span className="truncate">当前：{child.currentSchool || '未填写'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Icon name="Route" size="xs" className="text-text-muted" />
                  <span className="truncate">目标：{child.targetSchool || '未填写'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Icon name="Route" size="xs" className="text-text-muted" />
                  <span className="truncate">
                    路线：
                    {child.routeId ? getRouteById(child.routeId)?.name || child.routeId : '未绑定'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(child)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-surface-elevated px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-surface-highlight"
                >
                  <Icon name="Pencil" size="xs" />
                  编辑
                </button>
                {currentChildId !== child.id && (
                  <button
                    onClick={() => handleSetDefault(child.id)}
                    className="bg-primary/[0.08] hover:bg-primary/15 flex-1 rounded-lg px-3 py-2 text-xs text-primary transition-colors"
                  >
                    设为默认
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleAdd}
            className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-default bg-surface-elevated p-4 text-sm text-text-muted transition-all hover:border-border-default hover:bg-surface-elevated hover:text-text-secondary"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-surface-elevated">
              <Icon name="Plus" size="md" />
            </div>
            <span className="font-medium">添加孩子</span>
          </button>
        </div>
      </SettingsSection>

      <ChildModal isOpen={modalOpen} onClose={() => setModalOpen(false)} child={editingChild} />
    </div>
  );
}
