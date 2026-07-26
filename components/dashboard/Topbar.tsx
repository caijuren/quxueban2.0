'use client';

import { motion } from 'framer-motion';
import { Bell, Search, Menu, Plus, Check, User, Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { Child, gradeLabel, gradeToStage, getInitials } from '@/lib/children';
import ChildModal from '@/components/dashboard/ChildModal';

interface TopbarProps {
  onMenuClick?: () => void;
}

const searchConfig: Record<string, { placeholder: string; path: string }> = {
  '/dashboard/plan': { placeholder: '搜索路线、任务、学校...', path: '/dashboard/plan' },
  '/dashboard/schools': { placeholder: '搜索学校...', path: '/dashboard/schools' },
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { children, currentChild, setCurrentChildId } = useChildren();
  const [search, setSearch] = useState('');
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const childDropdownRef = useRef<HTMLDivElement>(null);

  const currentSearch = searchConfig[pathname] || null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        childDropdownRef.current &&
        !childDropdownRef.current.contains(e.target as Node)
      ) {
        setChildDropdownOpen(false);
      }
    };
    if (childDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [childDropdownOpen]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSearch) {
      const trimmed = search.trim();
      if (trimmed) {
        router.push(`${currentSearch.path}?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push(currentSearch.path);
      }
    }
  };

  const currentStage = currentChild ? gradeToStage(currentChild.grade) : null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass border-b border-white/5 z-30 px-4 sm:px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300"
          aria-label="打开菜单"
        >
          <Menu className="w-5 h-5" />
        </button>
        {currentSearch && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder={currentSearch.placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-10 pr-4 py-2 w-64 rounded-xl bg-surface border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => console.log('通知中心即将上线')}
          className="relative w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all"
          aria-label="通知"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={childDropdownRef}>
          <button
            onClick={() => setChildDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-4 border-l border-white/10 text-left"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">
                {currentChild ? currentChild.name : '未选择孩子'}
              </p>
              <p className="text-xs text-slate-500">
                {currentChild && currentStage
                  ? `${gradeLabel(currentChild.grade)} · ${currentStage}`
                  : '请选择或添加孩子'}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background: currentChild
                  ? `linear-gradient(135deg, ${currentChild.avatarColor}, ${currentChild.avatarColor}88)`
                  : 'linear-gradient(135deg, #475569, #64748b)',
              }}
              aria-label="孩子头像"
            >
              {currentChild ? getInitials(currentChild.name) : <User className="w-5 h-5" />}
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 hidden sm:block transition-transform duration-300 ${
                childDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {childDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl glass border border-white/10 overflow-hidden z-50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs text-slate-500">切换孩子</p>
              </div>
              <div className="p-1">
                {children.map((child) => {
                  const isActive = currentChild?.id === child.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => {
                        setCurrentChildId(child.id);
                        setChildDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
                        }}
                      >
                        {getInitials(child.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-slate-200'}`}>
                          {child.name}
                        </p>
                        <p className="text-xs text-slate-500">{gradeLabel(child.grade)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingChild(child);
                          setChildDropdownOpen(false);
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-all shrink-0"
                        aria-label="编辑孩子"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-white/5 p-1">
                <button
                  onClick={() => {
                    setChildDropdownOpen(false);
                    setShowChildModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  添加孩子
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChildModal
        isOpen={showChildModal}
        onClose={() => setShowChildModal(false)}
      />
      <ChildModal
        isOpen={Boolean(editingChild)}
        onClose={() => setEditingChild(null)}
        child={editingChild}
      />
    </motion.header>
  );
}
