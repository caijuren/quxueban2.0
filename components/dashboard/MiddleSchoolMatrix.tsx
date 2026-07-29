'use client';

import { motion } from 'framer-motion';
import { useState, type ElementType } from 'react';
import Link from 'next/link';
import {
  Target,
  MapPin,
  School,
  ClipboardList,
  TrendingUp,
  Shield,
  Zap,
  MapPinned,
  ExternalLink,
  Layers,
  Camera,
  Share2,
  Bookmark,
} from 'lucide-react';

type ChannelRole = 'primary' | 'optional' | 'partial' | 'none';

interface CellData {
  role: ChannelRole;
  note: string;
  short: string;
}

const channels = ['自招', '名额到区', '名额到校', '统招'];

const channelIcons: Record<string, React.ElementType> = {
  自招: Zap,
  名额到区: MapPin,
  名额到校: School,
  统招: ClipboardList,
};

const tiers = [
  {
    id: 'sizhong',
    name: '四校八大',
    color: 'rose',
    note: '全市顶尖；交附嘉定为本区四校分校，其余四校/八大主要走自招/到区',
  },
  {
    id: 'benshi',
    name: '本区市重点',
    color: 'violet',
    note: '交附嘉定、嘉定一中、上师大附属嘉定高中；名额到校/到区/统招并用',
  },
  {
    id: 'benqu',
    name: '本区区重点',
    color: 'cyan',
    note: '嘉定二中、安亭高中、嘉一实验等；到校/统招为主，部分有特色自招',
  },
  {
    id: 'zhongben',
    name: '中本贯通',
    color: 'emerald',
    note: '中职 3 年 + 本科 4 年，最终拿本科文凭；热门专业分数线常高于普高',
  },
  {
    id: 'benpu',
    name: '本区普高',
    color: 'slate',
    note: '中光高级中学、封浜高级中学等；统招为主，少量到校名额',
  },
  {
    id: 'zhonggaozhi',
    name: '中高职贯通',
    color: 'teal',
    note: '中职 3 年 + 高职 2 年，大专文凭',
  },
  {
    id: 'wunian',
    name: '五年一贯制',
    color: 'sky',
    note: '高职 5 年一贯培养，大专文凭',
  },
];

const roleConfig: Record<
  ChannelRole,
  { label: string; color: string; bg: string; border: string; glow: string; pillBg: string }
> = {
  primary: {
    label: '主通道',
    color: 'text-violet-300',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/40',
    glow: 'shadow-neon-violet',
    pillBg: 'bg-violet-500/25',
  },
  optional: {
    label: '可选',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/15',
    border: 'border-cyan-500/40',
    glow: 'shadow-glow-secondary',
    pillBg: 'bg-cyan-500/25',
  },
  partial: {
    label: '部分有',
    color: 'text-amber-300',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/40',
    glow: 'shadow-panel',
    pillBg: 'bg-amber-500/25',
  },
  none: {
    label: '不适用',
    color: 'text-slate-500',
    bg: 'bg-slate-500/5',
    border: 'border-slate-500/15',
    glow: '',
    pillBg: 'bg-slate-500/15',
  },
};

const cells: Record<string, Record<string, CellData>> = {
  sizhong: {
    自招: { role: 'primary', note: '竞赛/综评门票，全市尖子竞争', short: '尖子竞争' },
    名额到区: { role: 'primary', note: '到区名额少，分数线最高', short: '到区名额' },
    名额到校: {
      role: 'partial',
      note: '四校本部无到校名额；本区四校分校（如交附嘉定）有少量到校名额',
      short: '分校少量',
    },
    统招: { role: 'optional', note: '名额极少，裸分 710+，风险大', short: '裸分 710+' },
  },
  benshi: {
    自招: { role: 'optional', note: '交附嘉定/嘉定一中/上师嘉分特色班/理科选拔', short: '特色班' },
    名额到区: { role: 'primary', note: '本区层面竞争，核心路径之一', short: '区竞争' },
    名额到校: {
      role: 'primary',
      note: '按本区初中分配，看校内排名；需同一初中连续 3 年学籍',
      short: '校内排名',
    },
    统招: { role: 'primary', note: '平行志愿，分数说话', short: '平行志愿' },
  },
  benqu: {
    自招: { role: 'partial', note: '市特色高中（如嘉定二中）有少量自招名额', short: '少量' },
    名额到区: { role: 'none', note: '区重点/市特色高中不参与名额到区', short: '无' },
    名额到校: { role: 'primary', note: '到校名额较多，稳妥路径', short: '名额多' },
    统招: { role: 'primary', note: '平行志愿，保底首选', short: '保底' },
  },
  benpu: {
    自招: { role: 'none', note: '一般无自招', short: '无' },
    名额到区: { role: 'none', note: '无到区名额', short: '无' },
    名额到校: { role: 'partial', note: '少量到校名额', short: '少量' },
    统招: { role: 'primary', note: '统招，达到控分线', short: '控分线' },
  },
  zhongben: {
    自招: { role: 'none', note: '一般无自招', short: '无' },
    名额到区: { role: 'none', note: '无到区名额', short: '无' },
    名额到校: { role: 'none', note: '无到校名额', short: '无' },
    统招: {
      role: 'primary',
      note: '中职校提前批/统招，需达普高最低投档线，最终拿本科文凭',
      short: '本科文凭',
    },
  },
  zhonggaozhi: {
    自招: { role: 'none', note: '一般无自招', short: '无' },
    名额到区: { role: 'none', note: '无到区名额', short: '无' },
    名额到校: { role: 'none', note: '无到校名额', short: '无' },
    统招: { role: 'primary', note: '中职校统招录取，3+2 培养模式，大专文凭', short: '3+2 大专' },
  },
  wunian: {
    自招: { role: 'none', note: '一般无自招', short: '无' },
    名额到区: { role: 'none', note: '无到区名额', short: '无' },
    名额到校: { role: 'none', note: '无到校名额', short: '无' },
    统招: { role: 'primary', note: '高职院校五年一贯制统招录取，大专文凭', short: '5 年大专' },
  },
};

const outcomes = {
  sizhong: { label: '冲', prob: 12, name: '四校八大', color: '#f43f5e' },
  benshi: { label: '稳', prob: 55, name: '本区市重点', color: '#8b5cf6' },
  benqu: { label: '保', prob: 85, name: '本区区重点/特色', color: '#06b6d4' },
  benpu: { label: '底', prob: 95, name: '本区普高', color: '#64748b' },
  zhongben: { label: '本', prob: 75, name: '中本贯通', color: '#10b981' },
  zhonggaozhi: { label: '专', prob: 88, name: '中高职贯通', color: '#14b8a6' },
  wunian: { label: '专', prob: 90, name: '五年一贯制', color: '#0ea5e9' },
};

interface MapSchool {
  name: string;
  slug?: string;
  note?: string;
}

interface MapTier {
  id: string;
  name: string;
  color: string;
  bg: string;
  channel: string;
  schools: MapSchool[];
}

interface StrategyItem {
  icon: ElementType;
  title: string;
  value: string;
  desc: string;
  accent: string;
}

const jiadingMap: MapTier[] = [
  {
    id: 'benshi',
    name: '本区市重点',
    color: 'text-violet-300',
    bg: 'bg-violet-500/10',
    channel: '名额到区 / 名额到校 / 统招',
    schools: [
      { name: '交大附中嘉定分校', slug: 'jiaofu-jiading', note: '四校分校·本区' },
      { name: '嘉定一中', slug: 'jiading-yizhong', note: '区属市重点' },
      { name: '上师大附属嘉定高中', slug: 'shida-jiading', note: '新增市重点' },
    ],
  },
  {
    id: 'benqu',
    name: '本区区重点 / 市特色',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10',
    channel: '名额到校 / 统招为主',
    schools: [
      { name: '嘉定二中', slug: 'jiading-erzhong', note: '市特色高中' },
      { name: '安亭高级中学', slug: 'anting-gaozhong', note: '区重点' },
      { name: '嘉一实验高级中学', slug: 'jiading-shiyan', note: '区实验性示范' },
    ],
  },
  {
    id: 'benpu',
    name: '本区普高',
    color: 'text-slate-300',
    bg: 'bg-slate-500/10',
    channel: '统招为主，少量到校',
    schools: [
      { name: '中光高级中学', note: '公办普高' },
      { name: '封浜高级中学', note: '公办普高' },
    ],
  },
  {
    id: 'waiqu',
    name: '外区可冲',
    color: 'text-rose-300',
    bg: 'bg-rose-500/10',
    channel: '四校：自招/到区；其他市重点：名额到区',
    schools: [
      { name: '上海中学', slug: 'shangzhong', note: '四校 · 自招/到区' },
      { name: '华师大二附中', slug: 'huaer', note: '四校 · 自招/到区' },
      { name: '复旦附中', slug: 'fufu', note: '四校 · 自招/到区' },
      { name: '交大附中', note: '四校 · 自招/到区' },
      { name: '七宝中学', note: '名额到区' },
      { name: '建平中学', note: '名额到区' },
      { name: '南洋模范中学', note: '名额到区' },
    ],
  },
  {
    id: 'zhiguan',
    name: '中职贯通',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    channel: '提前批 / 统招录取',
    schools: [
      { name: '中本贯通', note: '3+4，最终拿本科文凭' },
      { name: '中高职贯通', note: '3+2，大专文凭' },
      { name: '五年一贯制', note: '5 年一贯，大专文凭' },
    ],
  },
];

const strategyByTier: Record<string, { focus: StrategyItem; high: StrategyItem; safe: StrategyItem }> = {
  sizhong: {
    focus: { icon: Target, title: '当前最该关注', value: '四校八大 · 自招/到区', desc: '准备竞赛奖项或保持全区前排名', accent: '#f43f5e' },
    high: { icon: TrendingUp, title: '冲高通道', value: '四校八大 · 自招', desc: '需要竞赛奖项或综评优秀', accent: '#f43f5e' },
    safe: { icon: Shield, title: '保底通道', value: '本区市重点 · 名额到校', desc: '校内排名争取名额，降低风险', accent: '#8b5cf6' },
  },
  benshi: {
    focus: { icon: Target, title: '当前最该关注', value: '本区市重点 · 名额到校', desc: '按就读初中的校内排名争取名额', accent: '#8b5cf6' },
    high: { icon: TrendingUp, title: '冲高通道', value: '四校八大 · 自招/到区', desc: '需要竞赛奖项或全区前排名', accent: '#f43f5e' },
    safe: { icon: Shield, title: '保底通道', value: '本区区重点 / 中本贯通', desc: '名额到校、统招、提前批多层兜底', accent: '#06b6d4' },
  },
  benqu: {
    focus: { icon: Target, title: '当前最该关注', value: '本区区重点 · 名额到校', desc: '校内排名争取名额，到校为主', accent: '#06b6d4' },
    high: { icon: TrendingUp, title: '冲高通道', value: '本区市重点 · 名额到校/统招', desc: '校内排名靠前或裸分冲刺', accent: '#8b5cf6' },
    safe: { icon: Shield, title: '保底通道', value: '本区普高 / 中本贯通', desc: '平行志愿、提前批录取兜底', accent: '#64748b' },
  },
  zhongben: {
    focus: { icon: Target, title: '当前最该关注', value: '中本贯通 · 提前批', desc: '关注招生简章与专业分数线', accent: '#10b981' },
    high: { icon: TrendingUp, title: '冲高通道', value: '本区市重点 · 统招', desc: '裸分够线可冲市重点', accent: '#8b5cf6' },
    safe: { icon: Shield, title: '保底通道', value: '中高职贯通 / 五年一贯制', desc: '同批提前批，多层兜底', accent: '#14b8a6' },
  },
  benpu: {
    focus: { icon: Target, title: '当前最该关注', value: '本区普高 · 统招', desc: '达到控分线，平行志愿保底', accent: '#64748b' },
    high: { icon: TrendingUp, title: '冲高通道', value: '本区区重点 · 名额到校', desc: '校内排名争取名额', accent: '#06b6d4' },
    safe: { icon: Shield, title: '保底通道', value: '中高职贯通 / 五年一贯制', desc: '中职提前批，确保有学上', accent: '#14b8a6' },
  },
  zhonggaozhi: {
    focus: { icon: Target, title: '当前最该关注', value: '中高职贯通 · 提前批', desc: '3+2 培养模式，关注专业', accent: '#14b8a6' },
    high: { icon: TrendingUp, title: '冲高通道', value: '中本贯通 · 提前批', desc: '需要达到更高分数线', accent: '#10b981' },
    safe: { icon: Shield, title: '保底通道', value: '五年一贯制 / 普通中专', desc: '同批录取，多层兜底', accent: '#0ea5e9' },
  },
  wunian: {
    focus: { icon: Target, title: '当前最该关注', value: '五年一贯制 · 提前批', desc: '5 年一贯培养，高职大专文凭', accent: '#0ea5e9' },
    high: { icon: TrendingUp, title: '冲高通道', value: '中高职贯通 · 提前批', desc: '专业选择更灵活', accent: '#14b8a6' },
    safe: { icon: Shield, title: '保底通道', value: '普通中专 / 技校', desc: '确保录取，后续可升学', accent: '#64748b' },
  },
};

export default function MiddleSchoolMatrix() {
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('benshi');

  const rowVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.06,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hud-panel p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-h2 neon-text mb-1">中考升学路径矩阵</h2>
            <p className="text-caption text-text-tertiary">
              纵向 = 目标学校层级（本区为主），横向 = 录取通道
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2 text-micro text-text-muted">
              <span className="hud-panel-hover flex items-center gap-1.5 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                主通道
              </span>
              <span className="hud-panel-hover flex items-center gap-1.5 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                可选
              </span>
              <span className="hud-panel-hover flex items-center gap-1.5 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                部分有
              </span>
              <span className="hud-panel-hover flex items-center gap-1.5 px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                不适用
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => console.log('导出图片')}
                className="hud-panel hud-panel-hover flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-micro text-text-secondary focus-ring"
              >
                <Camera className="w-3.5 h-3.5" />
                导出
              </button>
              <button
                onClick={() => console.log('分享')}
                className="hud-panel hud-panel-hover flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-micro text-text-secondary focus-ring"
              >
                <Share2 className="w-3.5 h-3.5" />
                分享
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Matrix */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hud-panel p-4 overflow-x-auto"
      >
        <div className="min-w-[800px]">
          {/* Column headers */}
          <div className="grid grid-cols-[220px_repeat(4,1fr)] gap-2.5 mb-2.5">
            <div className="hud-panel flex flex-col items-center justify-center gap-1.5 py-2.5 px-2">
              <Layers className="w-4 h-4 text-text-muted" />
              <span className="text-micro font-semibold text-text-muted uppercase tracking-wider">
                学校层级
              </span>
            </div>
            {channels.map((channel) => {
              const Icon = channelIcons[channel];
              const isHovered = hoveredChannel === channel;
              return (
                <motion.div
                  key={channel}
                  onMouseEnter={() => setHoveredChannel(channel)}
                  onMouseLeave={() => setHoveredChannel(null)}
                  className={`hud-panel-hover flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border transition-all duration-300 ${
                    isHovered ? 'bg-surface-light border-border-strong' : 'bg-surface-elevated border-border-default'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isHovered ? 'text-white' : 'text-text-tertiary'}`} />
                  <span className={`text-caption font-semibold ${isHovered ? 'text-white' : 'text-text-secondary'}`}>
                    {channel}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Rows */}
          {tiers.map((tier, tierIndex) => {
            const isTierHovered = hoveredTier === tier.id;
            const isCurrentTier = currentTier === tier.id;
            const outcome = outcomes[tier.id as keyof typeof outcomes];
            return (
              <motion.div
                key={tier.id}
                custom={tierIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className={`grid grid-cols-[220px_repeat(4,1fr)] gap-2.5 mb-2.5 rounded-lg ${
                  isCurrentTier ? 'shadow-neon' : ''
                }`}
                onMouseEnter={() => setHoveredTier(tier.id)}
                onMouseLeave={() => setHoveredTier(null)}
              >
                {/* Row header */}
                <div
                  className={`group relative flex flex-col justify-center gap-2 p-2.5 rounded-xl border transition-all duration-300 hud-panel-hover ${
                    isTierHovered
                      ? 'bg-surface-light border-border-strong shadow-panel'
                      : isCurrentTier
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-surface-elevated border-border-default'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            tier.color === 'rose'
                              ? '#f43f5e'
                              : tier.color === 'violet'
                              ? '#8b5cf6'
                              : tier.color === 'cyan'
                              ? '#06b6d4'
                              : tier.color === 'emerald'
                              ? '#10b981'
                              : tier.color === 'teal'
                              ? '#14b8a6'
                              : tier.color === 'sky'
                              ? '#0ea5e9'
                              : '#475569',
                          boxShadow: `0 0 8px ${
                            tier.color === 'rose'
                              ? '#f43f5e'
                              : tier.color === 'violet'
                              ? '#8b5cf6'
                              : tier.color === 'cyan'
                              ? '#06b6d4'
                              : tier.color === 'emerald'
                              ? '#10b981'
                              : tier.color === 'teal'
                              ? '#14b8a6'
                              : tier.color === 'sky'
                              ? '#0ea5e9'
                              : '#475569'
                          }`,
                        }}
                      />
                      <span className="text-caption font-bold text-text-secondary whitespace-nowrap">{tier.name}</span>
                    </div>
                    {outcome && (
                      <div className="flex items-center gap-1.5 shrink-0 pl-2 ml-1 border-l border-border-default">
                        <span
                          className="px-1.5 py-0.5 rounded text-micro font-bold"
                          style={{ backgroundColor: outcome.color, color: '#0f172a' }}
                        >
                          {outcome.label}
                        </span>
                        <span className="text-micro font-bold data-value" style={{ color: outcome.color }}>
                          {outcome.prob}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Probability micro bar */}
                  {outcome && (
                    <div className="w-full h-1 rounded-full bg-surface overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${outcome.prob}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + tierIndex * 0.06, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: outcome.color }}
                      />
                    </div>
                  )}

                  {/* Current tier badge */}
                  {isCurrentTier && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-white text-micro font-bold shadow-glow-primary">
                      当前目标
                    </div>
                  )}

                  {/* Row header hover tooltip */}
                  <div className="pointer-events-none absolute left-0 right-0 top-full z-30 mt-2 hidden group-hover:block">
                    <div className="rounded-lg hud-panel border border-border-default p-2.5 shadow-panel">
                      <p className="text-caption text-text-secondary leading-relaxed">{tier.note}</p>
                    </div>
                  </div>
                </div>

                {/* Cells */}
                {channels.map((channel) => {
                  const cell = cells[tier.id][channel];
                  const config = roleConfig[cell.role];
                  const isChannelHovered = hoveredChannel === channel;
                  const dimmed =
                    (hoveredTier && hoveredTier !== tier.id) ||
                    (hoveredChannel && hoveredChannel !== channel);
                  const isHighlighted = isChannelHovered || isTierHovered;
                  return (
                    <motion.div
                      key={channel}
                      onMouseEnter={() => setHoveredChannel(channel)}
                      onMouseLeave={() => setHoveredChannel(null)}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className={`group relative p-2.5 rounded-xl border transition-all duration-300 hud-panel-hover ${config.bg} ${config.border} ${config.glow} ${
                        dimmed ? 'opacity-35' : 'opacity-100'
                      } ${
                        isHighlighted
                          ? 'border-white/40 shadow-panel'
                          : ''
                      } ${isCurrentTier ? 'ring-1 ring-primary/20' : ''}`}
                    >
                      <div className="flex items-center gap-2 h-full">
                        <span
                          className={`shrink-0 min-w-[52px] text-center px-1.5 py-0.5 rounded-full text-micro font-bold ${config.color} ${config.pillBg}`}
                        >
                          {config.label}
                        </span>
                        {cell.role !== 'none' && (
                          <span className="text-caption font-medium truncate text-text-secondary">
                            {cell.short}
                          </span>
                        )}
                      </div>

                      {/* Hover tooltip */}
                      <div className="pointer-events-none absolute left-0 right-0 top-full z-30 mt-2 hidden group-hover:block">
                        <div className="rounded-lg hud-panel border border-border-default p-2.5 shadow-panel">
                          <p className="text-caption text-text-secondary leading-relaxed">{cell.note}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 名额到校资格提示：只在当前目标涉及名额到校时显示 */}
      {['sizhong', 'benshi', 'benqu', 'benpu'].includes(currentTier) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="hud-panel rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 shrink-0">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-caption font-bold text-amber-200 mb-1">名额到校资格门槛</h4>
              <p className="text-small text-text-tertiary leading-relaxed">
                嘉定区名额到校主要面向不择生源的初中。学生需在<strong>同一所初中连续就读满 3 年</strong>
                （含学籍与就读），民办初中是否具备名额到校资格以当年政策为准。提前转学、人户分离等情况可能影响资格。
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Jiading high school map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="hud-panel p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-rose-500/10">
            <MapPinned className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-h3 neon-text">嘉定区高中地图</h3>
            <p className="text-small text-text-tertiary">本区高中层级 + 外区可冲学校</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-stretch">
          {jiadingMap.map((tier) => (
            <div key={tier.id} className={`hud-panel-hover rounded-xl ${tier.bg} border border-white/5 p-3 flex flex-col`}>
              <div className="flex items-center justify-between mb-1">
                <h4 className={`text-caption font-bold font-display ${tier.color}`}>{tier.name}</h4>
              </div>
              <p className="text-micro text-text-tertiary mb-2">{tier.channel}</p>
              <div className="flex flex-wrap content-start gap-1.5 flex-1">
                {tier.schools.map((school) => {
                  const chip = (
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-caption text-text-secondary truncate">{school.name}</span>
                      {school.slug && (
                        <ExternalLink className="w-2.5 h-2.5 text-text-muted group-hover:text-white transition-colors shrink-0" />
                      )}
                    </div>
                  );
                  return school.slug ? (
                    <Link
                      key={school.name}
                      href={`/dashboard/schools/${school.slug}`}
                      className="group flex items-center gap-1 px-2 py-1 rounded-md bg-black/20 hover:bg-white/10 border border-white/5 transition-colors"
                    >
                      {chip}
                    </Link>
                  ) : (
                    <div
                      key={school.name}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/10 border border-white/5"
                    >
                      {chip}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {(() => {
          const strategy = strategyByTier[currentTier] || strategyByTier.benshi;
          return [strategy.focus, strategy.high, strategy.safe].map((item) => (
          <div
            key={item.title}
            className="hud-panel hud-panel-hover rounded-xl p-3 transition-colors"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${item.accent}15` }}>
                <item.icon className="w-3.5 h-3.5" style={{ color: item.accent }} />
              </div>
              <span className="text-small text-text-tertiary">{item.title}</span>
            </div>
            <p className="text-caption font-bold font-display mb-0.5">{item.value}</p>
            <p className="text-micro text-text-muted">{item.desc}</p>
          </div>
        ));
      })()}
      </motion.div>
    </div>
  );
}
