import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import MarketingHero from '@/components/marketing/MarketingHero';
import DashboardVisual from '@/components/marketing/DashboardVisual';
import CommandCard from '@/components/ui/CommandCard';
import { LineChart, AlertTriangle, Gauge } from 'lucide-react';

export const metadata: Metadata = {
  title: '进度追踪 - 趣学伴',
  description: '可视化仪表盘实时掌握各科准备度，识别超前、正常或落后的能力项',
};

const features = [
  {
    title: '可视化进度仪表盘',
    description: '数学、英语、语文、竞赛等能力项以图表形式展示，直观对比当前水平与目标要求之间的差距。',
  },
  {
    title: '健康度评分',
    description: '基于任务完成情况和能力进度，自动生成整体健康度评分，快速判断当前准备状态是否在线。',
  },
  {
    title: '风险项目高亮提醒',
    description: '进度落后或长期未更新的任务自动标红，帮助家长及时发现问题并介入调整。',
  },
  {
    title: '多孩子独立档案',
    description: '家里有多个孩子也能分别管理，每个孩子的进度、路线、里程碑都独立保存，互不干扰。',
  },
];

export default function ProgressMarketingPage() {
  return (
    <PageLayout ctaText="开始追踪进度">
      <MarketingHero
        eyebrow="Progress Tracking"
        title={
          <>
            实时追踪
            <br />
            <span className="text-text-muted">各科准备进度</span>
          </>
        }
        description="不知道孩子准备得怎么样？趣学伴用可视化仪表盘展示各科能力进度，哪里超前、哪里落后，一眼就能看清楚。"
        tags={[
          { icon: <LineChart className="w-3.5 h-3.5 text-primary" aria-hidden="true" />, text: '可视化仪表盘' },
          { icon: <Gauge className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />, text: '健康度评分' },
          { icon: <AlertTriangle className="w-3.5 h-3.5 text-warning" aria-hidden="true" />, text: '风险提醒' },
        ]}
        visual={<DashboardVisual />}
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border-subtle">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((item, index) => (
              <CommandCard key={item.title} className="p-5 h-full group" corner={index === 0}>
                <span className="text-3xl font-mono text-text-muted font-bold block mb-3 group-hover:text-primary transition-colors">
                  0{index + 1}
                </span>
                <h3 className="text-base font-bold font-display mb-2 text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-text-tertiary leading-relaxed">{item.description}</p>
              </CommandCard>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
