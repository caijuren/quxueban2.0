interface WechatAccessTokenResponse {
  access_token?: string;
  expires_in?: number;
  errcode?: number;
  errmsg?: string;
}

interface WechatSendMessageResponse {
  errcode?: number;
  errmsg?: string;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export function getWechatCredentials() {
  const appId = process.env.WECHAT_MINIAPP_APPID;
  const secret = process.env.WECHAT_MINIAPP_SECRET;

  if (!appId || !secret) {
    throw new Error('微信小程序 AppID 或 Secret 未配置');
  }

  return { appId, secret };
}

export async function getWechatAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessToken.expiresAt - 5 * 60 * 1000) {
    return cachedAccessToken.token;
  }

  const { appId, secret } = getWechatCredentials();
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`;

  const res = await fetch(url);
  const data: WechatAccessTokenResponse = await res.json();

  if (data.errcode || !data.access_token) {
    throw new Error(data.errmsg || '获取微信 access_token 失败');
  }

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 7200) * 1000,
  };

  return data.access_token;
}

export interface SubscribeMessageData {
  [key: string]: { value: string };
}

export async function sendSubscribeMessage(
  openId: string,
  templateId: string,
  data: SubscribeMessageData,
  page?: string
): Promise<void> {
  const accessToken = await getWechatAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;

  const body = {
    touser: openId,
    template_id: templateId,
    page,
    data,
    miniprogram_state: process.env.NODE_ENV === 'production' ? 'formal' : 'trial',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result: WechatSendMessageResponse = await res.json();

  if (result.errcode && result.errcode !== 0) {
    throw new Error(result.errmsg || `发送订阅消息失败: ${result.errcode}`);
  }
}
