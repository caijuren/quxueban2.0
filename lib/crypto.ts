import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ENC_PREFIX = 'enc:v1:';

function getKey(): Buffer {
  const secret = process.env.CONFIG_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new Error(
      'CONFIG_ENCRYPTION_KEY 未配置或长度不足 32 位，无法加解密敏感配置'
    );
  }
  return scryptSync(secret, 'quxueban-config-salt', 32);
}

export function isEncrypted(value: string): boolean {
  return typeof value === 'string' && value.startsWith(ENC_PREFIX);
}

export function encryptSecret(plain: string): string {
  if (!plain) return plain;
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return (
    ENC_PREFIX + Buffer.concat([iv, authTag, encrypted]).toString('base64')
  );
}

export function decryptSecret(stored: string): string {
  if (!stored) return stored;
  if (!isEncrypted(stored)) {
    return stored;
  }
  const key = getKey();
  const raw = Buffer.from(stored.slice(ENC_PREFIX.length), 'base64');
  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const data = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    'utf8'
  );
}
