import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import RouteMapVisual from '@/components/marketing/RouteMapVisual';
import { Route, GitBranch, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: '路线方案 - 趣学伴',
  description: '三公、摇号、对口、直升等多路线评估，为孩子设计清晰的升学路线',
};

export default function PlanMarketingPage() {
  return (
    <PageLayout ctaText="免费绘制升学地图">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest mb-4 block">
                Route Planning
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display leading-[0.95] mb-6">
                为孩子设计
                <br />
                <span className="text-slate-500">清晰的升学路线</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
                三公、摇号、对口、直升……上海升学路径复杂多变。趣学伴帮助你评估多条路线的可行性，制定主路线与备选方案。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <Route className="w-4 h-4 text-primary" />
                  多路线并行
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <GitBranch className="w-4 h-4 text-secondary" />
                  主备切换
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <Target className="w-4 h-4 text-accent" />
                  目标匹配
                </div>
              </div>
            </div>
            <RouteMapVisual />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {[
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
            ].map((item, index) => (
              <div key={item.title} className="group p-8 sm:p-10 bg-background hover:bg-surface/50 transition-colors duration-300">
                <span className="text-4xl font-mono text-slate-700 font-bold block mb-4 group-hover:text-primary transition-colors">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-bold font-display mb-3 text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
