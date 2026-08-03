'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Save, Loader2, Eye, EyeOff, RefreshCw, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import SettingsSection from './SettingsSection';

interface AiConfig {
  id?: string;
  provider: string;
  apiKeyMasked: string;
  apiUrl: string;
  model: string;
  isEnabled: boolean;
}

interface ProviderInfo {
  label: string;
  defaultUrl: string;
  models: string[];
}

interface ModelInfo {
  label: string;
  description: string;
}

const PROVIDERS: Record<string, ProviderInfo> = {
  deepseek: {
    label: 'DeepSeek',
    defaultUrl: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  openai: {
    label: 'OpenAI',
    defaultUrl: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o-mini', 'gpt-4o'],
  },
};

const MODEL_INFO: Record<string, ModelInfo> = {
  'deepseek-chat': {
    label: 'DeepSeek Chat',
    description: '通用对话模型，响应速度快，适合日常任务检视与学习建议。',
  },
  'deepseek-reasoner': {
    label: 'DeepSeek Reasoner',
    description: '深度思考模型，擅长复杂推理与详细诊断报告生成。',
  },
  'gpt-4o-mini': {
    label: 'GPT-4o mini',
    description: 'OpenAI 轻量模型，性价比高，适合常规内容生成。',
  },
  'gpt-4o': {
    label: 'GPT-4o',
    description: 'OpenAI 旗舰模型，综合能力最强，适合高要求诊断场景。',
  },
};

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
    setMessage(null);
    try {
      const res = await fetch('/api/admin/ai-config');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '获取配置失败');
      }
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
    const p = PROVIDERS[provider];
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
      <SettingsSection title="AI 配置" description="配置 AI 检视功能调用的模型和 API Key">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </SettingsSection>
    );
  }

  const providerInfo = PROVIDERS[form.provider];
  const modelInfo = MODEL_INFO[form.model];
  const keyIsMasked = form.apiKey.includes('*');

  return (
    <div className="space-y-3">
      <SettingsSection title="AI 配置" description="配置 AI 检视功能调用的模型和 API Key">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-text-tertiary">AI 提供商</label>
              <select
                value={form.provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full rounded-lg bg-surface-elevated border border-border-default px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
              >
                {Object.entries(PROVIDERS).map(([value, p]) => (
                  <option key={value} value={value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-text-tertiary">模型</label>
              <select
                value={form.model}
                onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
                className="w-full rounded-lg bg-surface-elevated border border-border-default px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
              >
                {providerInfo?.models.map((m) => (
                  <option key={m} value={m}>
                    {MODEL_INFO[m]?.label || m}
                  </option>
                ))}
              </select>
              {modelInfo && (
                <p className="text-[11px] text-text-muted leading-tight">{modelInfo.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-tertiary">API URL</label>
            <input
              type="text"
              value={form.apiUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, apiUrl: e.target.value }))}
              className="w-full rounded-lg bg-surface-elevated border border-border-default px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
              placeholder="https://api.deepseek.com/v1/chat/completions"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-text-tertiary">API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={form.apiKey}
                onChange={(e) => setForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                className="w-full rounded-lg bg-surface-elevated border border-border-default px-3 py-2 pr-10 text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
                placeholder="sk-..."
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-text-muted flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Key 加密存储在数据库，前端仅显示脱敏后的后 4 位
            </p>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span className="text-xs font-medium text-text-secondary">启用 AI 检视</span>
            </div>
            <button
              onClick={() => setForm((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                form.isEnabled ? 'bg-primary' : 'bg-surface-highlight'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  form.isEnabled ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </SettingsSection>

      {message && (
        <div
          className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-danger/10 text-danger border border-danger/20'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap justify-end items-center gap-2">
        <button
          onClick={handleTest}
          disabled={testing || !form.apiKey || keyIsMasked}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-default text-text-secondary text-xs font-medium hover:bg-surface-highlight transition-all disabled:opacity-70"
        >
          {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          测试连接
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !form.apiKey}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          保存配置
        </button>
      </div>
    </div>
  );
}
