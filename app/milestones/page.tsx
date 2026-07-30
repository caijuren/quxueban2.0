import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import MarketingHero from '@/components/marketing/MarketingHero';
import TimelineVisual from '@/components/marketing/TimelineVisual';
import CommandCard from '@/components/ui/CommandCard';
import { Bell, Layers, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: '里程碑 - 趣学伴',
  description: '把升学目标拆解成可执行的时间节点，按年级、学期、月度追踪关键任务',
};

const levels = [
  {
    grade: '年级目标',
    example: '五年级完成三公报名并取得录取',
    detail: '明确这一年的终极目标和验收标准',
  },
  {
    grade: '学期目标',
    example: '上学期完成 AMC8 首考，下学期冲刺高分',
    detail: '把年级目标拆到上下学期，便于跟踪',
  },
  {
    grade: '月度任务',
    example: '9 月完成小托福报名，10 月参加模考',
    detail: '每月有具体动作，不遗漏关键准备',
  },
  {
    grade: '周计划',
    example: '本周完成 3 次奥数练习 + 1 次英语阅读',
    detail: '落实到每周可执行的学习安排',
  },
];

export default function MilestonesMarketingPage() {
  return (
    <PageLayout ctaText="立即建立里程碑">
      <MarketingHero
        eyebrow="Milestones"
        title={
          <>
            把大目标
            <br />
            <span className="text-text-muted">拆成可执行节点</span>
          </>
        }
        description="升学不是一蹴而就。趣学伴将长远目标拆分为年级目标、学期目标、月度任务和周计划，让每一步都有明确的截止时间。"
        tags={[
          { icon: <Layers className="w-3.5 h-3.5 text-primary" aria-hidden="true" />, text: '层级拆解' },
          { icon: <Bell className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />, text: '节点提醒' },
          { icon: <CheckCircle2 className="w-3.5 h-3.5 text-accent" aria-hidden="true" />, text: '进度可视化' },
        ]}
        visual={<TimelineVisual />}
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-3">
            {levels.map((item, index) => (
              <CommandCard key={item.grade} className="p-5 group">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-48 shrink-0">
                    <span className="text-[10px] font-mono text-primary">LEVEL 0{index + 1}</span>
                    <h3 className="text-base font-bold font-display mt-0.5">{item.grade}</h3>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary font-medium mb-0.5">{item.example}</p>
                    <p className="text-xs text-text-tertiary">{item.detail}</p>
                  </div>
                </div>
              </CommandCard>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
