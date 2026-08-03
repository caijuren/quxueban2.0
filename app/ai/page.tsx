import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import MarketingHero from '@/components/marketing/MarketingHero';
import AIReportVisual from '@/components/marketing/AIReportVisual';
import CommandCard from '@/components/ui/CommandCard';
import { Target, AlertTriangle, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI 诊断 - 趣学伴',
  description: '基于孩子当前进度，AI 智能诊断路线匹配度、识别风险并给出调整建议',
};

const features = [
  {
    title: '路线匹配度分析',
    description: '基于孩子当前年级、能力进度和目标学校，评估三公、摇号、直升等路线的匹配程度，找到最适合的主攻方向。',
  },
  {
    title: '进度健康度诊断',
    description: '对比同龄孩子的平均准备节奏，识别超前、正常或落后的能力项，明确接下来要补强的重点。',
  },
  {
    title: '风险预警与调整',
    description: '当关键任务逾期、路线概率下降或熔断点临近时，主动提醒并建议切换到更合适的备选方案。',
  },
  {
    title: '月度重点建议',
    description: '每月生成一份 AI 诊断摘要，告诉你本月最值得投入精力的任务和需要关注的风险点。',
  },
];

export default function AIMarketingPage() {
  return (
    <PageLayout ctaText="体验 AI 诊断">
      <MarketingHero
        eyebrow="AI Intelligence"
        eyebrowColor="secondary"
        title={
          <>
            AI 主动诊断
            <br />
            <span className="text-slate-500">与调整建议</span>
          </>
        }
        description="输入孩子当前进度，AI 帮你判断路线是否合理、哪些任务需要加强、是否需要启动备选方案。"
        tags={[
          { icon: <Target className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />, text: '路线匹配度' },
          { icon: <TrendingUp className="w-3.5 h-3.5 text-accent" aria-hidden="true" />, text: '健康度诊断' },
          { icon: <AlertTriangle className="w-3.5 h-3.5 text-warning" aria-hidden="true" />, text: '风险预警' },
        ]}
        visual={<AIReportVisual />}
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((item, index) => (
              <CommandCard key={item.title} className="p-5 h-full group" corner={index === 0}>
                <span className="text-3xl font-mono text-slate-700 font-bold block mb-3 group-hover:text-secondary transition-colors">
                  0{index + 1}
                </span>
                <h3 className="text-base font-bold font-display mb-2 text-text-primary group-hover:text-secondary transition-colors">
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
