export interface AiFetchOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 500;

function isRetriableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function aiFetch(
  url: string,
  init: RequestInit = {},
  options: AiFetchOptions = {}
): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options.retries ?? DEFAULT_RETRIES;
  const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);

      if (isRetriableStatus(response.status) && attempt < retries) {
        await sleep(retryDelayMs * 2 ** attempt);
        continue;
      }

      return response;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;

      const aborted = err instanceof Error && err.name === 'AbortError';
      const wrapped = aborted
        ? new Error(`AI 请求超时（${timeoutMs}ms）`)
        : err;

      if (attempt < retries) {
        await sleep(retryDelayMs * 2 ** attempt);
        continue;
      }

      throw wrapped;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('AI 请求失败');
}
