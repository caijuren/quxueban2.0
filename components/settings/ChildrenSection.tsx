'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, School, Route } from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildModal from '@/components/dashboard/ChildModal';
import { Child, gradeLabel, gradeToStage, getInitials } from '@/lib/children';
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
    <div className="space-y-5">
      <SettingsSection title="学员管理" description="管理孩子的学习档案">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div
              key={child.id}
              className="relative p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              {currentChildId === child.id && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3" />
                  默认
                </div>
              )}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
                  }}
                >
                  {child.avatarUrl?.startsWith('data:image') ? (
                    <img
                      src={child.avatarUrl}
                      alt={child.name}
                      className="w-full h-full object-cover"
                    />
                  ) : child.avatarUrl ? (
                    <span className="text-2xl">{child.avatarUrl}</span>
                  ) : (
                    getInitials(child.name)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold font-display text-slate-100 truncate">
                    {child.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {gradeLabel(child.grade)} · {gradeToStage(child.grade)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">
                    当前：{child.currentSchool || '未填写'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Route className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">
                    目标：{child.targetSchool || '未填写'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Route className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">
                    路线：{child.routeId ? getRouteById(child.routeId)?.name || child.routeId : '未绑定'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(child)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  编辑
                </button>
                {currentChildId !== child.id && (
                  <button
                    onClick={() => handleSetDefault(child.id)}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/15 transition-colors"
                  >
                    设为默认
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleAdd}
            className="min-h-[180px] rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02] p-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all text-sm"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium">添加学员</span>
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
