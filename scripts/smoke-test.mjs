const baseUrl = (process.env.SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

async function expectStatus(path, init, expected) {
  const response = await fetch(`${baseUrl}${path}`, init);
  if (response.status !== expected) {
    throw new Error(`${path}: expected ${expected}, received ${response.status}`);
  }
}

await expectStatus('/api/health', undefined, 200);
await expectStatus('/api/miniapp/jobs/daily-reminder', { method: 'POST' }, 401);
await expectStatus('/api/uploads/avatars/missing.png', undefined, 401);

console.log(`Smoke tests passed against ${baseUrl}`);
