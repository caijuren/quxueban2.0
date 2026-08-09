'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import SettingsSection from './SettingsSection';
import FormField from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Switch from '@/components/ui/switch';
import Button from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import Alert from '@/components/ui/alert';

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
          <Spinner size="md" color="primary" />
        </div>
      </SettingsSection>
    );
  }

  const providerInfo = PROVIDERS[form.provider];
  const modelInfo = MODEL_INFO[form.model];

  return (
    <div className="space-y-3">
      <SettingsSection title="AI 配置" description="配置 AI 检视功能调用的模型和 API Key">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="AI 提供商">
              <Select
                value={form.provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                options={Object.entries(PROVIDERS).map(([value, p]) => ({
                  value,
                  label: p.label,
                }))}
              />
            </FormField>

            <FormField label="模型" helper={modelInfo?.description}>
              <Select
                value={form.model}
                onChange={(e) => setForm((prev) => ({ ...prev, model: e.target.value }))}
                options={
                  providerInfo?.models.map((m) => ({
                    value: m,
                    label: MODEL_INFO[m]?.label || m,
                  })) ?? []
                }
              />
            </FormField>
          </div>

          <FormField label="API URL">
            <Input
              type="text"
              value={form.apiUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, apiUrl: e.target.value }))}
              placeholder="https://api.deepseek.com/v1/chat/completions"
            />
          </FormField>

          <FormField label="API Key" helper="Key 加密存储在数据库，前端仅显示脱敏后的后 4 位">
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={form.apiKey}
                onChange={(e) => setForm((prev) => ({ ...prev, apiKey: e.target.value }))}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showKey ? '隐藏 API Key' : '显示 API Key'}
              >
                {showKey ? <Icon name="EyeOff" size="sm" /> : <Icon name="Eye" size="sm" />}
              </Button>
            </div>
          </FormField>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size="sm" animate="pulse" className="text-secondary" />
              <span className="text-sm font-medium text-text-secondary">启用 AI 检视</span>
            </div>
            <Switch
              checked={form.isEnabled}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isEnabled: checked }))}
              size="sm"
            />
          </div>
        </div>
      </SettingsSection>

      {message && (
        <Alert type={message.type} title={message.type === 'success' ? '操作成功' : '操作失败'}>
          {message.text}
        </Alert>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Icon name="RefreshCw" size="sm" />}
          onClick={handleTest}
          isLoading={testing}
          disabled={!config}
        >
          测试连接
        </Button>
        <Button
          size="sm"
          leftIcon={<Icon name="Save" size="sm" />}
          onClick={handleSave}
          isLoading={saving}
          disabled={!form.apiKey}
        >
          保存配置
        </Button>
      </div>
    </div>
  );
}
