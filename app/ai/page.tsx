import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import AIReportVisual from '@/components/marketing/AIReportVisual';
import { Target, AlertTriangle, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI 检视 - 趣学伴',
  description: '基于孩子当前进度，AI 智能诊断路线匹配度、识别风险并给出调整建议',
};

export default function AIMarketingPage() {
  return (
    <PageLayout ctaText="体验 AI 检视">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono text-secondary uppercase tracking-widest mb-4 block">
                AI Intelligence
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display leading-[0.95] mb-6">
                AI 主动诊断
                <br />
                <span className="text-slate-500">与调整建议</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
                输入孩子当前进度，AI 帮你判断路线是否合理、哪些任务需要加强、是否需要启动备选方案。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <Target className="w-4 h-4 text-secondary" />
                  路线匹配度
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  健康度诊断
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  风险预警
                </div>
              </div>
            </div>
            <AIReportVisual />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {[
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
                description: '每月生成一份 AI 检视摘要，告诉你本月最值得投入精力的任务和需要关注的风险点。',
              },
            ].map((item, index) => (
              <div key={item.title} className="group p-8 sm:p-10 bg-background hover:bg-surface/50 transition-colors duration-300">
                <span className="text-4xl font-mono text-slate-700 font-bold block mb-4 group-hover:text-secondary transition-colors">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-bold font-display mb-3 text-white group-hover:text-secondary transition-colors">
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
