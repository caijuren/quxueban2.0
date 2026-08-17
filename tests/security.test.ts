import assert from 'node:assert/strict';
import test from 'node:test';
import { bindRateLimit, getClientIp } from '../lib/rateLimit';
import { generateInviteToken } from '../lib/invite';
import { isUserOwnedUpload, isViewableTaskEvidence } from '../lib/uploadSecurity';
import { getInvalidProductionSecrets } from '../scripts/validate-production-env.js';
import { isDingTalkConfigured, sendDingTalkMarkdown } from '../lib/dingtalk';

test('bind rate limiter rejects requests after the configured limit', async () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  const results = [];
  for (let i = 0; i < 9; i += 1) {
    results.push(await bindRateLimit(key));
  }

  assert.equal(results.slice(0, 8).every((result) => result.allowed), true);
  assert.equal(results[8].allowed, false);
  assert.equal(results[8].remaining, 0);
});

test('client IP prefers the first forwarded address', () => {
  const request = new Request('https://example.test', {
    headers: {
      'x-forwarded-for': '203.0.113.10, 10.0.0.2',
      'x-real-ip': '198.51.100.8',
    },
  });

  assert.equal(getClientIp(request), '203.0.113.10');
});

test('invite tokens are URL-safe, high-entropy values', () => {
  const token = generateInviteToken();

  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(token, generateInviteToken());
});

test('upload ownership checks reject cross-user and unsupported paths', () => {
  assert.equal(isUserOwnedUpload('avatars', 'user-123-file.png', 'user-123'), true);
  assert.equal(isUserOwnedUpload('avatars', 'user-456-file.png', 'user-123'), false);
  assert.equal(isUserOwnedUpload('../general', 'user-123-file.png', 'user-123'), false);
});

test('task evidence checks accept only viewable child prefixes', () => {
  assert.equal(
    isViewableTaskEvidence('evidence-child-1-task-1.png', ['child-1', 'child-2']),
    true
  );
  assert.equal(
    isViewableTaskEvidence('evidence-child-3-task-1.png', ['child-1', 'child-2']),
    false
  );
});

test('production environment validation rejects missing or placeholder secrets', () => {
  const invalid = getInvalidProductionSecrets({
    NEXTAUTH_SECRET: 'short',
    MINIAPP_JWT_SECRET: 'short',
    CRON_SECRET: 'change-me-to-a-random-cron-secret',
    POSTGRES_PASSWORD: undefined,
    ADMIN_PASSWORD: 'short',
    DEMO_PARENT_PASSWORD: 'short',
    CONFIG_ENCRYPTION_KEY: 'change-me-min-32-chars-strong-random-key',
  });

  assert.deepEqual(invalid, [
    'NEXTAUTH_SECRET',
    'MINIAPP_JWT_SECRET',
    'CRON_SECRET',
    'POSTGRES_PASSWORD',
    'ADMIN_PASSWORD',
    'DEMO_PARENT_PASSWORD',
    'CONFIG_ENCRYPTION_KEY',
  ]);
});

test('production environment validation accepts strong non-placeholder secrets', () => {
  const strong = 'a'.repeat(32);
  assert.deepEqual(
    getInvalidProductionSecrets({
      NEXTAUTH_SECRET: strong,
      MINIAPP_JWT_SECRET: `${strong}b`,
      CRON_SECRET: `${strong}c`,
      POSTGRES_PASSWORD: `${strong}d`,
      ADMIN_PASSWORD: `${strong}e`,
      DEMO_PARENT_PASSWORD: `${strong}f`,
      CONFIG_ENCRYPTION_KEY: `${strong}g`,
    }),
    []
  );
});

test('child DingTalk configuration does not borrow the global webhook', () => {
  const previous = process.env.DINGTALK_WEBHOOK;
  process.env.DINGTALK_WEBHOOK = 'https://global.example.test';

  assert.equal(isDingTalkConfigured({ webhook: 'https://child.example.test' }), true);
  assert.equal(isDingTalkConfigured({ webhook: '' }), false);

  if (previous === undefined) delete process.env.DINGTALK_WEBHOOK;
  else process.env.DINGTALK_WEBHOOK = previous;
});

test('child DingTalk push does not sign with the global secret', async () => {
  const previousWebhook = process.env.DINGTALK_WEBHOOK;
  const previousSecret = process.env.DINGTALK_SECRET;
  const previousFetch = globalThis.fetch;
  let requestedUrl = '';

  process.env.DINGTALK_WEBHOOK = 'https://global.example.test';
  process.env.DINGTALK_SECRET = 'global-secret';
  globalThis.fetch = (async (input) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({ errcode: 0 }), { status: 200 });
  }) as typeof fetch;

  const result = await sendDingTalkMarkdown(
    { title: 'test', text: 'test' },
    { webhook: 'https://child.example.test', secret: null }
  );

  assert.equal(result.success, true);
  assert.equal(requestedUrl, 'https://child.example.test');

  globalThis.fetch = previousFetch;
  if (previousWebhook === undefined) delete process.env.DINGTALK_WEBHOOK;
  else process.env.DINGTALK_WEBHOOK = previousWebhook;
  if (previousSecret === undefined) delete process.env.DINGTALK_SECRET;
  else process.env.DINGTALK_SECRET = previousSecret;
});
