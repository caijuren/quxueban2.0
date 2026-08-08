import { Icon } from '@/components/ui/icon';
import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import MarketingHero from '@/components/marketing/MarketingHero';
import RouteMapVisual from '@/components/marketing/RouteMapVisual';
import CommandCard from '@/components/ui/CommandCard';

export const metadata: Metadata = {
  title: '路线方案 - 趣学伴',
  description: '三公、摇号、对口、直升等多路线评估，为孩子设计清晰的升学路线',
};

const features = [
  {
    title: '多路线并行评估',
    description:
      '同时对比三公、民办摇号、公办对口、一贯制直升等路线，根据孩子当前情况选择最适合的主攻方向。',
  },
  {
    title: '主路线 + 备选路线',
    description:
      '不只规划一条路，提前设置备选方案。当主路线遇到瓶颈时，快速切换到更稳妥的升学路径。',
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
            <span className="text-text-muted">清晰的升学路线</span>
          </>
        }
        description="三公、摇号、对口、直升……上海升学路径复杂多变。趣学伴帮助你评估多条路线的可行性，制定主路线与备选方案。"
        tags={[
          {
            icon: <Icon name="Route" size="xs" className="text-primary" aria-hidden="true" />,
            text: '多路线并行',
          },
          {
            icon: <Icon name="GitBranch" size="xs" className="text-secondary" aria-hidden="true" />,
            text: '主备切换',
          },
          {
            icon: <Icon name="Target" size="xs" className="text-accent" aria-hidden="true" />,
            text: '目标匹配',
          },
        ]}
        visual={<RouteMapVisual />}
      />

      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((item, index) => (
              <CommandCard key={item.title} className="group h-full p-5" corner={index === 0}>
                <span className="mb-3 block font-mono text-3xl font-bold text-text-muted transition-colors group-hover:text-primary">
                  0{index + 1}
                </span>
                <h3 className="mb-2 font-display text-base font-bold text-text-primary transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-tertiary">{item.description}</p>
              </CommandCard>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
