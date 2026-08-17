import assert from 'node:assert/strict';
import test from 'node:test';
import { encryptSecret, decryptSecret, isEncrypted } from '../lib/crypto';
import { aiFetch } from '../lib/ai/fetchWithResilience';

process.env.CONFIG_ENCRYPTION_KEY =
  process.env.CONFIG_ENCRYPTION_KEY ?? 'a'.repeat(32);

test('encryptSecret produces a versioned ciphertext that round-trips', () => {
  const plain = 'sk-super-secret-api-key-12345';
  const encrypted = encryptSecret(plain);

  assert.equal(isEncrypted(encrypted), true);
  assert.notEqual(encrypted, plain);
  assert.equal(decryptSecret(encrypted), plain);
});

test('encryptSecret uses a random IV so ciphertexts differ each call', () => {
  const plain = 'same-plaintext';
  const a = encryptSecret(plain);
  const b = encryptSecret(plain);

  assert.notEqual(a, b);
  assert.equal(decryptSecret(a), plain);
  assert.equal(decryptSecret(b), plain);
});

test('decryptSecret passes through plaintext that is not encrypted', () => {
  assert.equal(decryptSecret('plain-legacy-value'), 'plain-legacy-value');
  assert.equal(decryptSecret(''), '');
});

test('decryptSecret rejects tampered ciphertext via auth tag', () => {
  const encrypted = encryptSecret('tamper-me');
  const tampered = encrypted.slice(0, -4) + 'AAAA';

  assert.throws(() => decryptSecret(tampered));
});

test('aiFetch retries retriable 5xx statuses then returns final response', async () => {
  const previousFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    if (calls < 3) {
      return new Response('busy', { status: 503 });
    }
    return new Response('ok', { status: 200 });
  }) as typeof fetch;

  try {
    const res = await aiFetch(
      'https://ai.example.test',
      {},
      { retries: 2, retryDelayMs: 1 }
    );
    assert.equal(res.status, 200);
    assert.equal(calls, 3);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('aiFetch does not retry non-retriable 4xx statuses', async () => {
  const previousFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    return new Response('bad', { status: 400 });
  }) as typeof fetch;

  try {
    const res = await aiFetch(
      'https://ai.example.test',
      {},
      { retries: 3, retryDelayMs: 1 }
    );
    assert.equal(res.status, 400);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('aiFetch surfaces a timeout error after exhausting retries', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = ((_url: string, init: RequestInit = {}) => {
    return new Promise((_resolve, reject) => {
      const signal = init.signal;
      if (signal) {
        signal.addEventListener('abort', () => {
          const err = new Error('aborted');
          err.name = 'AbortError';
          reject(err);
        });
      }
    });
  }) as unknown as typeof fetch;

  try {
    await assert.rejects(
      aiFetch(
        'https://ai.example.test',
        {},
        { timeoutMs: 5, retries: 1, retryDelayMs: 1 }
      ),
      /超时/
    );
  } finally {
    globalThis.fetch = previousFetch;
  }
});
