import crypto from 'crypto';

export interface DingTalkMessage {
  title: string;
  text: string;
}

export interface DingTalkPushResult {
  success: boolean;
  message: string;
}

export interface DingTalkConfig {
  webhook: string;
  secret?: string | null;
}

function generateSign(timestamp: string, secret: string): string {
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(stringToSign);
  return encodeURIComponent(hmac.digest('base64'));
}

export async function sendDingTalkMarkdown(
  message: DingTalkMessage,
  config?: DingTalkConfig
): Promise<DingTalkPushResult> {
  // A child-level configuration is isolated from global fallback credentials.
  const webhook = config ? config.webhook : process.env.DINGTALK_WEBHOOK;
  const secret = config ? config.secret : process.env.DINGTALK_SECRET;

  if (!webhook) {
    return {
      success: false,
      message: '未配置钉钉 Webhook，无法推送消息',
    };
  }

  const timestamp = Date.now().toString();
  let url = webhook;

  if (secret) {
    const sign = generateSign(timestamp, secret);
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}timestamp=${timestamp}&sign=${sign}`;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          title: message.title,
          text: message.text,
        },
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      errcode?: number;
      errmsg?: string;
    };

    if (!res.ok || data.errcode !== 0) {
      return {
        success: false,
        message: data.errmsg || `钉钉返回错误，状态码 ${res.status}`,
      };
    }

    return { success: true, message: '推送成功' };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : '推送请求失败',
    };
  }
}

export function isDingTalkConfigured(config?: DingTalkConfig): boolean {
  return Boolean(config ? config.webhook : process.env.DINGTALK_WEBHOOK);
}
