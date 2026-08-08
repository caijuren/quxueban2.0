import { Icon } from '@/components/ui/icon';
import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import MarketingHero from '@/components/marketing/MarketingHero';
import TimelineVisual from '@/components/marketing/TimelineVisual';
import CommandCard from '@/components/ui/CommandCard';

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
          {
            icon: <Icon name="Layers" size="xs" className="text-primary" aria-hidden="true" />,
            text: '层级拆解',
          },
          {
            icon: <Icon name="Bell" size="xs" className="text-secondary" aria-hidden="true" />,
            text: '节点提醒',
          },
          {
            icon: <Icon name="CheckCircle2" size="xs" className="text-accent" aria-hidden="true" />,
            text: '进度可视化',
          },
        ]}
        visual={<TimelineVisual />}
      />

      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-3">
            {levels.map((item, index) => (
              <CommandCard key={item.grade} className="group p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="shrink-0 md:w-48">
                    <span className="font-mono text-[10px] text-primary">LEVEL 0{index + 1}</span>
                    <h3 className="mt-0.5 font-display text-base font-bold">{item.grade}</h3>
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-sm font-medium text-text-primary">{item.example}</p>
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
