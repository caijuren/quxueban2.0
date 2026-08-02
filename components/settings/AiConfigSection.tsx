'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Save, Loader2, Eye, EyeOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AiConfig {
  id?: string;
  provider: string;
  apiKeyMasked: string;
  apiUrl: string;
  model: string;
  isEnabled: boolean;
}

const PROVIDERS = [
  { value: 'deepseek', label: 'DeepSeek', defaultUrl: 'https://api.deepseek.com/v1/chat/completions', models: ['deepseek-chat', 'deepseek-reasoner'] },
  { value: 'openai', label: 'OpenAI', defaultUrl: 'https://api.openai.com/v1/chat/completions', models: ['gpt-4o-mini', 'gpt-4o'] },
];

export default function AiConfigSection() {
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    provider: 'deepseek',
    apiKey: '',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    isEnabled: true,
  });

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai-config');
      if (!res.ok) throw new Error('获取配置失败');
      const data = (await res.json()) as AiConfig | null;
      if (data) {
        setConfig(data);
        setForm({
          provider: data.provider,
          apiKey: data.apiKeyMasked,
          apiUrl: data.apiUrl,
          model: data.model,
          isEnabled: data.isEnabled,
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '获取配置失败' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleProviderChange = (provider: string) => {
    const p = PROVIDERS.find((x) => x.value === provider);
    setForm((prev) => ({
      ...prev,
      provider,
      apiUrl: p?.defaultUrl || prev.apiUrl,
      model: p?.models[0] || prev.model,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '保存失败');
      setConfig(data);
      setForm((prev) => ({ ...prev, apiKey: data.apiKeyMasked }));
      setMessage({ type: 'success', text: 'AI 配置已保存' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '保存失败' });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setMessage(null);
    try {
      // 调用一个轻量级接口测试连通性
      const res = await fetch('/api/admin/ai-config/test', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '连接失败');
      setMessage({ type: 'success', text: '连接成功' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '连接失败' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl glass p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const providerInfo = PROVIDERS.find((p) => p.value === form.provider);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass p-6 space-y-6"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display">AI 配置</h2>
          <p className="text-sm text-slate-400">配置 AI 检视功能调用的模型和 API Key</p>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-xl p-3 text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-error/10 text-error border border-error/20'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm text-slate-300">AI 提供商</label>
          <select
            value={form.provider}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full rounded-xl bg-surface border border-white/[0.08] px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-secondary/50"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">模型</label>
          <select
            value={form.model}
            onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
            className="w-full rounded-xl bg-surface border border-white/[0.08] px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-secondary/50"
          >
            {providerInfo?.models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-slate-300">API URL</label>
          <input
            type="text"
            value={form.apiUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, apiUrl: e.target.value }))}
            className="w-full rounded-xl bg-surface border border-white/[0.08] px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-secondary/50"
            placeholder="https://api.deepseek.com/v1/chat/completions"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-slate-300">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={form.apiKey}
              onChange={(e) => setForm((prev) => ({ ...prev, apiKey: e.target.value }))}
              className="w-full rounded-xl bg-surface border border-white/[0.08] px-4 py-2.5 pr-10 text-sm text-slate-200 focus:outline-none focus:border-secondary/50"
              placeholder="sk-..."
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-500">Key 会加密存储在数据库中，前端仅显示脱敏后的后 4 位</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isEnabled}
              onChange={(e) => setForm((prev) => ({ ...prev, isEnabled: e.target.checked }))}
              className="w-4 h-4 rounded border-white/[0.08] bg-surface text-secondary focus:ring-secondary"
            />
            <span className="text-sm text-slate-300">启用 AI 检视</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          保存配置
        </button>

        <button
          onClick={handleTest}
          disabled={testing || !form.apiKey || form.apiKey.includes('*')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/[0.08] text-sm font-semibold text-slate-200 hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          测试连接
        </button>
      </div>
    </motion.div>
  );
}
