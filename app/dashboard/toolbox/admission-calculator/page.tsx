'use client';
import { Icon } from '@/components/ui/icon';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { apiPost } from '@/lib/apiClient';

interface CalculatorResult {
  eligible: boolean;
  level: 'highly_likely' | 'possible' | 'unlikely' | 'not_eligible';
  reason: string;
  suggestions: string[];
}

const levelConfig = {
  highly_likely: {
    icon: 'CheckCircle2',
    title: '大概率符合',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
  },
  possible: {
    icon: 'HelpCircle',
    title: '可能符合',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
  unlikely: {
    icon: 'AlertCircle',
    title: '不符合或存疑',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  not_eligible: {
    icon: 'XCircle',
    title: '不符合',
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/20',
  },
};

export default function AdmissionCalculatorPage() {
  const shouldReduceMotion = useReducedMotion();
  const [registrationType, setRegistrationType] = useState('本市学籍');
  const [householdType, setHouseholdType] = useState('本市户籍');
  const [continuousYears, setContinuousYears] = useState(3);
  const [hasProperty, setHasProperty] = useState(false);
  const [socialInsuranceYears, setSocialInsuranceYears] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await apiPost<{ result: CalculatorResult }>('/api/toolbox/admission-calculator', {
        registrationType,
        householdType,
        continuousYears,
        hasPropertyInDistrict: hasProperty,
        socialInsuranceYears,
      });
      setResult(res.result);
    } catch (err) {
      console.error('[admission-calculator]', err);
      setResult({
        eligible: false,
        level: 'not_eligible',
        reason: '计算失败，请检查输入后重试。',
        suggestions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-4xl space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Calculator" size="md" className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              名额到校计算器
            </h1>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-elevated p-5 sm:p-6"
      >
        <div className="bg-primary/5 pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl" />
        <div className="relative space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">学籍</label>
            <div className="flex flex-wrap gap-2">
              {['本市学籍', '外地学籍'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRegistrationType(opt)}
                  className={`h-10 rounded-xl border px-4 text-sm transition-all ${
                    registrationType === opt
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-border-default bg-surface text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">户籍</label>
            <div className="flex flex-wrap gap-2">
              {['本市户籍', '非本市户籍'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setHouseholdType(opt)}
                  className={`h-10 rounded-xl border px-4 text-sm transition-all ${
                    householdType === opt
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-border-default bg-surface text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">
              连续就读年限：<span className="font-semibold text-primary">{continuousYears} 年</span>
            </label>
            <input
              type="range"
              min={0}
              max={9}
              step={1}
              value={continuousYears}
              onChange={(e) => setContinuousYears(parseInt(e.target.value, 10))}
              className="w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-2xs text-text-muted">
              <span>0 年</span>
              <span>9 年</span>
            </div>
          </div>

          {householdType === '非本市户籍' && (
            <>
              <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface p-4">
                <input
                  id="hasProperty"
                  type="checkbox"
                  checked={hasProperty}
                  onChange={(e) => setHasProperty(e.target.checked)}
                  className="size-4 rounded accent-primary"
                />
                <label htmlFor="hasProperty" className="text-sm text-text-secondary">
                  在本区有房产
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  父母一方社保连续缴纳年限：{socialInsuranceYears} 年
                </label>
                <input
                  type="range"
                  min={0}
                  max={15}
                  step={1}
                  value={socialInsuranceYears}
                  onChange={(e) => setSocialInsuranceYears(parseInt(e.target.value, 10))}
                  className="w-full accent-primary"
                />
              </div>
            </>
          )}

          <button
            onClick={calculate}
            disabled={loading}
            className="h-12 w-full rounded-xl bg-primary font-semibold text-inverse transition-colors hover:bg-primary-glow disabled:opacity-60"
          >
            {loading ? '计算中...' : '计算资格'}
          </button>
        </div>
      </motion.div>

      {result && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl border ${levelConfig[result.level].border} ${levelConfig[result.level].bg} p-5 sm:p-6`}
        >
          <div className="flex items-start gap-4">
            <Icon
              name={levelConfig[result.level].icon}
              size="xl"
              className={`size-8 ${levelConfig[result.level].color} shrink-0`}
            />
            <div className="flex-1">
              <h2
                className={`font-display text-xl font-bold ${levelConfig[result.level].color} mb-2`}
              >
                {levelConfig[result.level].title}
              </h2>
              <p className="mb-4 text-sm text-text-secondary">{result.reason}</p>
              {result.suggestions.length > 0 && (
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-tertiary">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-text-muted" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-xl border border-dashed border-border-default bg-surface-elevated p-4 text-center"
      >
        <p className="text-sm text-text-muted">
          本计算器结果仅供参考，具体名额到校资格以当年教育局政策与学校审核为准。
        </p>
      </motion.div>
    </div>
  );
}
