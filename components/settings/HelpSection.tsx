'use client';

import { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
} from 'lucide-react';
import packageInfo from '@/package.json';
import SettingsSection from './SettingsSection';

const FAQS = [
  {
    q: '如何添加多个孩子？',
    a: '在「孩子管理」中点击「添加孩子」，填写姓名、年级等基本信息即可。你可以随时切换默认孩子。',
  },
  {
    q: '周计划是如何生成的？',
    a: '系统会根据孩子当前年级和已绑定的升学路线，自动生成每周学习任务，你也可以在周计划页面手动调整。',
  },
  {
    q: 'AI 诊断报告什么时候更新？',
    a: '发布本周计划后，AI 会根据任务完成情况和孩子的阶段生成诊断报告，可在「AI 诊断」页面查看。',
  },
  {
    q: '支持微信登录吗？',
    a: '正式版将支持微信一键登录和微信提醒，当前请使用账号密码登录。',
  },
];

export default function HelpSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [feedback, setFeedback] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    setSubmitting(true);
    // TODO: send feedback to backend or IM
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setSubmitted(true);
    setFeedback('');
    setContact('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="常见问题" description="快速了解趣学伴的使用方法">
        <div className="space-y-2">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-surface-elevated"
                >
                  <span className="text-sm font-medium text-text-secondary">{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="size-4 text-text-muted" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-sm leading-relaxed text-text-tertiary">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection title="意见反馈" description="遇到问题或有新想法，告诉我们">
        <div className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="请描述你遇到的问题或建议..."
            rows={4}
            className="w-full resize-none rounded-xl border border-border-default bg-surface-elevated px-4 py-3 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="联系方式（选填）"
            className="w-full rounded-xl border border-border-default bg-surface-elevated px-4 py-2.5 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
          />
          {submitted && (
            <div className="bg-success/10 border-success/20 rounded-lg border px-4 py-2 text-sm text-success">
              反馈已提交，感谢你的建议！
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleSubmitFeedback}
              disabled={submitting || !feedback.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-all hover:opacity-90 disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              提交反馈
            </button>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="关于" description="版本与法律信息">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href="/terms"
            target="_blank"
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:bg-surface-elevated"
          >
            <FileText className="size-5 text-primary" />
            <span className="text-sm text-text-secondary">用户协议</span>
          </a>
          <a
            href="/privacy"
            target="_blank"
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:bg-surface-elevated"
          >
            <FileText className="size-5 text-secondary" />
            <span className="text-sm text-text-secondary">隐私政策</span>
          </a>
        </div>
        <p className="mt-4 text-center text-xs text-text-muted">
          趣学伴 v{packageInfo.version} · 升学规划中心
        </p>
      </SettingsSection>
    </div>
  );
}
