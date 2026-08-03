import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import MarketingHero from '@/components/marketing/MarketingHero';
import RouteMapVisual from '@/components/marketing/RouteMapVisual';
import CommandCard from '@/components/ui/CommandCard';
import { Route, GitBranch, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: '路线方案 - 趣学伴',
  description: '三公、摇号、对口、直升等多路线评估，为孩子设计清晰的升学路线',
};

const features = [
  {
    title: '多路线并行评估',
    description: '同时对比三公、民办摇号、公办对口、一贯制直升等路线，根据孩子当前情况选择最适合的主攻方向。',
  },
  {
    title: '主路线 + 备选路线',
    description: '不只规划一条路，提前设置备选方案。当主路线遇到瓶颈时，快速切换到更稳妥的升学路径。',
  },
  {
    title: '关键熔断点提醒',
    description: '在三年级、四年级、五年级等关键节点设置检查点，未达标时主动提醒家长及时调整策略。',
  },
  {
    title: '目标学校匹配分析',
    description: '结合学校招生偏好与孩子能力项，评估目标学校匹配度，让准备更有针对性。',
  },
];

export default function PlanMarketingPage() {
  return (
    <PageLayout ctaText="免费绘制升学地图">
      <MarketingHero
        eyebrow="Route Planning"
        title={
          <>
            为孩子设计
            <br />
            <span className="text-slate-500">清晰的升学路线</span>
          </>
        }
        description="三公、摇号、对口、直升……上海升学路径复杂多变。趣学伴帮助你评估多条路线的可行性，制定主路线与备选方案。"
        tags={[
          { icon: <Route className="w-3.5 h-3.5 text-primary" aria-hidden="true" />, text: '多路线并行' },
          { icon: <GitBranch className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />, text: '主备切换' },
          { icon: <Target className="w-3.5 h-3.5 text-accent" aria-hidden="true" />, text: '目标匹配' },
        ]}
        visual={<RouteMapVisual />}
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((item, index) => (
              <CommandCard key={item.title} className="p-5 h-full group" corner={index === 0}>
                <span className="text-3xl font-mono text-slate-700 font-bold block mb-3 group-hover:text-primary transition-colors">
                  0{index + 1}
                </span>
                <h3 className="text-base font-bold font-display mb-2 text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </CommandCard>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
