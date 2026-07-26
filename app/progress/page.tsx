import { Metadata } from 'next';
import PageLayout from '@/components/marketing/PageLayout';
import DashboardVisual from '@/components/marketing/DashboardVisual';
import { LineChart, AlertTriangle, Gauge } from 'lucide-react';

export const metadata: Metadata = {
  title: '进度追踪 - 趣学伴',
  description: '可视化仪表盘实时掌握各科准备度，识别超前、正常或落后的能力项',
};

export default function ProgressMarketingPage() {
  return (
    <PageLayout ctaText="开始追踪进度">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest mb-4 block">
                Progress Tracking
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-display leading-[0.95] mb-6">
                实时追踪
                <br />
                <span className="text-slate-500">各科准备进度</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
                不知道孩子准备得怎么样？趣学伴用可视化仪表盘展示各科能力进度，哪里超前、哪里落后，一眼就能看清楚。
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <LineChart className="w-4 h-4 text-primary" />
                  可视化仪表盘
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <Gauge className="w-4 h-4 text-secondary" />
                  健康度评分
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/5 bg-surface/30 text-sm text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  风险提醒
                </div>
              </div>
            </div>
            <DashboardVisual />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {[
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
