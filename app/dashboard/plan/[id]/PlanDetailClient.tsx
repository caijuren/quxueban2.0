'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Lightbulb,
  FileText,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  plans,
  middleSchoolPlans,
  sgKeyResults,
  sgSubjectPaths,
  sgRouteMatrix,
  sgMatrixGrades,
  typeConfig,
  statusConfig,
} from '@/lib/plans';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import RouteMatrix from './RouteMatrix';

function childGradeToMatrixGrade(grade: number): string {
  const map: Record<number, string> = {
    1: '二年级',
    2: '三年级',
    3: '四年级',
    4: '五年级上',
    5: '五年级上',
  };
  return map[grade] || '二年级';
}

const detailTasks: Record<string, { title: string; items: string[] }[]> = {
  sg: [
    {
      title: '三年级 · 基础搭建期',
      items: [
        '系统学习奥数，完成三年级奥数体系',
        '三年级寒假冲 KET 卓越 140+，目标词汇量 3000+',
        '培养阅读习惯，每周精读2篇中文/英文文章',
        '参加1-2项兴趣类竞赛或活动',
      ],
    },
    {
      title: '四年级 · 能力突破期',
      items: [
        '首次参加AMC8考试，熟悉竞赛题型',
        '四年级寒假冲 PET 卓越 160+，春季小托福首考 800+',
        '参加语文类竞赛（如汉字小达人、古诗文大会）',
        '建立错题本，形成各科知识体系',
      ],
    },
    {
      title: '五年级上 · 冲刺提升期',
      items: [
        'AMC8二次冲刺，目标20分+',
        '小托福冲刺850+',
        '综合素质材料整理（证书、活动、获奖）',
        '模拟面谈训练，提升表达能力',
      ],
    },
    {
      title: '五年级下 · 报名面谈期',
      items: [
        '4月中旬完成三公网上报名',
        '准备面谈材料，突出数理和英语优势',
        '参加4月中下旬面谈',
        '根据结果调整后续升学方案',
      ],
    },
  ],
  yaohao: [
    {
      title: '五年级上 · 志愿调研期',
      items: [
        '调研嘉定区民办初中：华曜嘉定、华盛怀少、桃李园',
        '评估走读/住宿方案，考虑通勤因素',
        '准备户籍/居住证等报名材料',
        '制定"冲-稳-保"志愿策略',
      ],
    },
    {
      title: '五年级下 4月 · 网上报名',
      items: [
        '登录"上海市义务教育入学报名系统"',
        '填报1-2个民办志愿',
        '确认报名信息无误',
        '保存报名凭证',
      ],
    },
    {
      title: '五年级下 5月 · 摇号录取',
      items: [
        '关注摇号时间（通常5月中下旬）',
        '查询录取结果',
        '如未录取，及时转入公办对口流程',
        '确认录取后按学校要求缴费注册',
      ],
    },
    {
      title: '六年级 · 入学准备',
      items: [
        '参加分班考或摸底测试',
        '预习初中课程',
        '调整学习节奏，适应民办初中强度',
        '建立初中阶段学习目标',
      ],
    },
  ],
  gongban: [
    {
      title: '五年级 · 确认对口',
      items: [
        '核实对口公办学校和入学政策',
        '确认户籍/房产是否符合对口要求',
        '了解一贯制学校直升条件',
        '关注学校特色班选拔信息',
      ],
    },
    {
      title: '五年级下 · 办理入学',
      items: [
        '按时完成公办初中入学信息登记',
        '提交相关证明材料',
        '参加学校开放日或家长会',
        '确认录取通知',
      ],
    },
    {
      title: '六年级 · 小升初衔接',
      items: [
        '巩固小学知识，预习初一内容',
        '培养自主学习能力',
        '适应初中学习节奏',
        '关注特色班或分层教学机会',
      ],
    },
  ],
  sizhong: [
    {
      title: '六年级-七年级 · 基础与竞赛启蒙',
      items: [
        '保持校内全科前列，建立初中知识体系',
        '系统学习初中奥数，接触物理/信息学',
        '英语达到中考优秀以上，向高考水平过渡',
        '参加科创活动，培养研究性学习能力',
      ],
    },
    {
      title: '八年级 · 竞赛锁定门票',
      items: [
        '参加数学/物理/信息学竞赛并争取省级奖项',
        '完成 1-2 个研究性学习课题或科创项目',
        '保持校内排名前 3%，关注四校开放日',
        '训练自招笔试基础题型',
      ],
    },
    {
      title: '初三上 · 自招冲刺',
      items: [
        '整理竞赛证书、综合素质档案',
        '针对性训练四校自招笔试',
        '模拟面试与表达能力训练',
        '一模争取全区前列',
      ],
    },
    {
      title: '初三下 · 中考与录取',
      items: [
        '填报名额分配到区/到校志愿',
        '参加四校自招测试与综评',
        '中考稳定发挥，确保裸分竞争力',
        '确认录取意向',
      ],
    },
  ],
  shizhong: [
    {
      title: '六年级-七年级 · 打牢基础',
      items: [
        '保持校内成绩前列，数学英语超前学习',
        '建立错题本与知识体系',
        '培养阅读习惯与写作能力',
        '积极参加学校活动',
      ],
    },
    {
      title: '八年级 · 优势学科突破',
      items: [
        '理科分层突破，避免偏科',
        '语文/英语保持优势，持续积累',
        '参加区级学科竞赛',
        '一模前全面复习',
      ],
    },
    {
      title: '初三上 · 一模与志愿',
      items: [
        '一模定位市重点区间',
        '了解名额分配到区/到校政策',
        '整理综合素质档案',
        '参加目标高中开放日',
      ],
    },
    {
      title: '初三下 · 中考冲刺',
      items: [
        '合理填报名额分配与平行志愿',
        '二模查漏补缺',
        '中考稳定发挥',
        '确认录取',
      ],
    },
  ],
  quzhong: [
    {
      title: '六年级-七年级 · 补齐基础',
      items: [
        '稳定校内成绩，补齐小学薄弱知识点',
        '培养 1-2 门优势学科',
        '养成预习、复习、错题整理习惯',
        '关注学校特色项目',
      ],
    },
    {
      title: '八年级 · 分水岭巩固',
      items: [
        '理科不掉队，语文/英语持续积累',
        '参加学校特色活动或社团',
        '一模前系统复习',
        '了解区重点/特色高中招生',
      ],
    },
    {
      title: '初三上 · 目标锁定',
      items: [
        '一模定位区重点/特色高中区间',
        '整理综合素质档案',
        '参加开放日，了解特色项目',
        '制定提分计划',
      ],
    },
    {
      title: '初三下 · 冲刺中考',
      items: [
        '合理填报志愿，确保保底',
        '二模冲刺，针对性提分',
        '中考稳定发挥',
        '确认录取',
      ],
    },
  ],
};

const resources: Record<string, { title: string; desc: string; icon: typeof BookOpen }[]> = {
  sg: [
    { title: 'AMC8 历年真题', desc: '2015-2024年真题及解析', icon: FileText },
    { title: '小托福备考资料', desc: '词汇、听力、阅读专项训练', icon: BookOpen },
    { title: '三公面谈题库', desc: '历年面谈真题模拟', icon: Lightbulb },
    { title: '奥数体系课程', desc: '三年级至五年级系统课程', icon: Calendar },
  ],
  yaohao: [
    { title: '嘉定民办初中对比', desc: '华曜、怀少、桃李园详细对比', icon: FileText },
    { title: '摇号政策解读', desc: '2025年民办摇号最新政策', icon: BookOpen },
    { title: '志愿填报指南', desc: '冲稳保策略与风险提示', icon: Lightbulb },
    { title: '入学准备清单', desc: '录取后需要办理的事项', icon: Calendar },
  ],
  gongban: [
    { title: '对口学校查询', desc: '嘉定区公办对口范围查询', icon: FileText },
    { title: '一贯制直升政策', desc: '直升条件与流程说明', icon: BookOpen },
    { title: '特色班信息', desc: '各校特色班选拔要求', icon: Lightbulb },
    { title: '小升初衔接课', desc: '暑假预习计划与资源', icon: Calendar },
  ],
  sizhong: [
    { title: '四校自招真题', desc: '近年自主招生笔试与面试题', icon: FileText },
    { title: '竞赛培优路径', desc: '数学/物理/信息学竞赛规划', icon: BookOpen },
    { title: '综评面试指南', desc: '综合素质评价与面试技巧', icon: Lightbulb },
    { title: '四校分数线', desc: '名额分配到区与平行志愿数据', icon: Calendar },
  ],
  shizhong: [
    { title: '嘉定市重点分数线', desc: '交附嘉定、嘉一中等近年投档线', icon: FileText },
    { title: '名额分配政策', desc: '到区/到校志愿填报策略', icon: BookOpen },
    { title: '一模二模资料', desc: '嘉定区历年模考试卷与解析', icon: Lightbulb },
    { title: '中考志愿填报', desc: '平行志愿与名额分配组合策略', icon: Calendar },
  ],
  quzhong: [
    { title: '区重点特色项目', desc: '嘉定二中、安亭高中等特色招生', icon: FileText },
    { title: '保底志愿策略', desc: '防止滑档的填报技巧', icon: BookOpen },
    { title: '中考基础题训练', desc: '稳拿基础分，避免失误', icon: Lightbulb },
    { title: '提分计划', desc: '针对薄弱科目的快速提分方案', icon: Calendar },
  ],
};

export default function PlanDetailClient({ id }: { id: string }) {
  const params = useParams();
  const planId = (params.id as string) || id;
  const { currentChild } = useChildren();
  const allPlans = [...plans, ...middleSchoolPlans];
  const plan = allPlans.find((p) => p.id === planId);
  const matrixCurrentGrade = currentChild
    ? childGradeToMatrixGrade(currentChild.grade)
    : '一升二';

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold font-display mb-2">方案未找到</h1>
        <p className="text-slate-400 mb-6">该路线方案不存在或已被删除</p>
        <Link
          href="/dashboard/plan"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all"
        >
          返回路线方案
        </Link>
      </div>
    );
  }

  const type = typeConfig[plan.type];
  const status = statusConfig[plan.status];
  const tasks = detailTasks[plan.id] || [];
  const planResources = resources[plan.id] || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <Link
            href="/dashboard/plan"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            返回路线方案
          </Link>
          <h1 className="text-3xl font-bold font-display">{plan.name} · 完整方案</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${type.bg} ${type.color} border ${type.border}`}>
            {type.label}
          </span>
          <span className={`flex items-center gap-1 text-sm font-medium ${status.color}`}>
            <status.icon className="w-4 h-4" />
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* Overview card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`rounded-2xl glass p-6 border ${plan.type === 'primary' ? 'border-primary/30' : 'border-white/5'} relative overflow-hidden`}
      >
        {plan.type === 'primary' && (
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        )}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold font-display mb-3">路线概述</h2>
            <p className="text-slate-300 leading-relaxed mb-4">{plan.description}</p>
            <div className="flex flex-wrap gap-2">
              {plan.requirements.map((req) => (
                <span
                  key={req}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-slate-300 border border-white/10"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center lg:items-end">
            <p className="text-sm text-slate-400 mb-1">路线匹配度</p>
            <p
              className={`text-5xl font-bold font-display ${
                plan.probability >= 80 ? 'text-success' : plan.probability >= 60 ? 'text-warning' : 'text-slate-300'
              }`}
            >
              {plan.probability}%
            </p>
            <p className="text-xs text-slate-500 mt-2">
              {plan.probability >= 80 ? '匹配度较高' : plan.probability >= 60 ? '有提升空间' : '需要重点突破'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* SG-only route matrix */}
      {plan.id === 'sg' && (
        <RouteMatrix
          rows={sgRouteMatrix}
          grades={sgMatrixGrades}
          currentGrade={matrixCurrentGrade}
          currentChildGrade={currentChild?.grade ?? 1}
        />
      )}

      {/* Target schools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl glass p-6 border border-white/5"
      >
        <h2 className="text-xl font-bold font-display mb-6">
          {['sizhong', 'shizhong', 'quzhong'].includes(plan.id)
            ? '目标高中'
            : plan.id === 'sg'
            ? '目标学校'
            : plan.id === 'yaohao'
            ? '目标民办'
            : '保底选项'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plan.targets.map((school, index) => (
            <Link key={school.slug} href={`/dashboard/schools/${school.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group rounded-xl glass p-5 border border-white/5 cursor-pointer transition-all duration-300 ${school.shadow}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${school.color} flex items-center justify-center shrink-0`}>
                    <school.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold font-display group-hover:text-white transition-colors">
                      {school.name}
                    </h4>
                    <p className="text-xs text-slate-400">{school.tag}</p>
                  </div>
                </div>
                <p className="text-sm text-primary group-hover:text-primary-glow transition-colors flex items-center gap-1">
                  查看学校详情 <ChevronLeft className="w-3 h-3 rotate-180" />
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl glass p-6 border border-white/5"
      >
        <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          备考资源推荐
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {planResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="rounded-xl bg-white/5 p-4 border border-white/5 hover:border-primary/30 hover:bg-white/[0.07] transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <resource.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-medium text-slate-200 mb-1">{resource.title}</h4>
              <p className="text-xs text-slate-500">{resource.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-between rounded-2xl glass p-6 border border-white/5"
      >
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          最近更新：2 天前
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all">
          制定提升计划
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
