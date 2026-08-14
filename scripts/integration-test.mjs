/**
 * Read-only API contract checks against a running deployment.
 * Set INTEGRATION_BASE_URL to enable the suite.
 */
const baseUrl = (process.env.INTEGRATION_BASE_URL || '').replace(/\/$/, '');

if (!baseUrl) {
  console.log('Integration tests skipped: set INTEGRATION_BASE_URL to enable them.');
  process.exit(0);
}

const cookie = process.env.INTEGRATION_COOKIE;

async function request(path, init = {}) {
  const headers = new Headers(init.headers);
  headers.set('accept', 'application/json');
  if (cookie) headers.set('cookie', cookie);
  return fetch(`${baseUrl}${path}`, { ...init, headers, redirect: 'manual' });
}

async function expectStatus(path, expected, init) {
  const response = await request(path, init);
  if (response.status !== expected) {
    const body = await response.text();
    throw new Error(`${path}: expected ${expected}, received ${response.status}: ${body.slice(0, 240)}`);
  }
}

async function expectJsonStatus(path, expected, init) {
  const response = await request(path, init);
  const contentType = response.headers.get('content-type') || '';
  if (response.status === expected && contentType.includes('application/json')) return;

  const body = await response.text();
  throw new Error(
    `${path}: expected ${expected} JSON, received ${response.status} ${contentType}: ${body.slice(0, 240)}`,
  );
}

async function expectOneOf(path, expected, init) {
  const response = await request(path, init);
  if (!expected.includes(response.status)) {
    const body = await response.text();
    throw new Error(`${path}: expected ${expected.join(' or ')}, received ${response.status}: ${body.slice(0, 240)}`);
  }
}

async function expectProtected(path, init) {
  const response = await request(path, init);
  if ([401, 403, 302, 307].includes(response.status)) return;
  if (response.status === 200 && response.headers.get('content-type')?.includes('text/html')) return;
  const body = await response.text();
  throw new Error(`${path}: protected endpoint returned ${response.status}: ${body.slice(0, 240)}`);
}

await expectStatus('/api/health', 200);

if (!cookie) {
  await expectProtected('/api/admin/stats');
  await expectProtected('/api/admin/ai-config');
  await expectProtected('/api/user/bind-code', { method: 'POST' });
  await expectProtected('/api/family/invites');
  await expectProtected('/api/uploads/avatars/missing.png');
  await expectProtected('/api/miniapp/jobs/daily-reminder', { method: 'POST' });
} else {
  await expectJsonStatus('/api/user/me', 200);
  await expectJsonStatus('/api/family', 200);
  await expectJsonStatus('/api/children', 200);
  await expectJsonStatus('/api/notifications', 200);
  await expectJsonStatus('/api/capabilities', 200);
  await expectJsonStatus('/api/task-templates', 200);
  await expectJsonStatus('/api/weekly-plans', 200);
  await expectOneOf('/api/admin/stats', [200, 403]);
  await expectOneOf('/api/admin/ai-config', [200, 403]);
  await expectOneOf('/api/family/invites', [200, 403]);
}

console.log(`Integration tests passed against ${baseUrl}${cookie ? ' (authenticated)' : ''}`);
