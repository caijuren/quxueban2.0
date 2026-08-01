'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, School, Route } from 'lucide-react';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="relative p-4 rounded-xl bg-surface-elevated border border-border-subtle hover:border-border-default transition-all"
            >
              {currentChildId === child.id && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-2xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3" />
                  默认
                </div>
              )}
              <div className="flex items-start gap-3 mb-4">
                <ChildAvatar child={child} size="xl" shape="rounded" />
                <div className="min-w-0">
                  <h3 className="text-base font-bold font-display text-text-primary truncate">
                    {child.name}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {gradeLabel(child.grade, child.educationSystem)} · {gradeToStage(child.grade, child.educationSystem)} · {educationSystemLabel(child.educationSystem)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <School className="w-3.5 h-3.5 text-text-muted" />
                  <span className="truncate">
                    当前：{child.currentSchool || '未填写'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Route className="w-3.5 h-3.5 text-text-muted" />
                  <span className="truncate">
                    目标：{child.targetSchool || '未填写'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Route className="w-3.5 h-3.5 text-text-muted" />
                  <span className="truncate">
                    路线：{child.routeId ? getRouteById(child.routeId)?.name || child.routeId : '未绑定'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(child)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-surface-elevated text-text-secondary text-xs hover:bg-surface-highlight transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  编辑
                </button>
                {currentChildId !== child.id && (
                  <button
                    onClick={() => handleSetDefault(child.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary/[0.08] text-primary text-xs hover:bg-primary/15 transition-colors"
                  >
                    设为默认
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleAdd}
            className="min-h-[180px] rounded-xl border border-dashed border-border-default bg-surface-elevated p-4 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-secondary hover:bg-surface-elevated hover:border-border-default transition-all text-sm"
          >
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium">添加孩子</span>
          </button>
        </div>
      </SettingsSection>

      <ChildModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        child={editingChild}
      />
    </div>
  );
}
