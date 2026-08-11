const requiredSecrets = [
  'NEXTAUTH_SECRET',
  'MINIAPP_JWT_SECRET',
  'CRON_SECRET',
  'POSTGRES_PASSWORD',
  'ADMIN_PASSWORD',
  'DEMO_PARENT_PASSWORD',
];

const insecureValues = new Set([
  'change-me-in-production',
  'change-me-in-production-min-32-chars-long',
  'change-me-to-a-random-cron-secret',
  'change-me-for-demo-account',
  'build-time-placeholder',
]);

export function getInvalidProductionSecrets(env) {
  return requiredSecrets.filter((name) => {
    const value = env[name];
    if (!value) return true;
    if (insecureValues.has(value)) return true;
    // 数据库密码允许使用现有较短的值，其他密钥仍要求 32 位以上
    if (name === 'POSTGRES_PASSWORD') return false;
    return value.length < 32;
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const invalid = getInvalidProductionSecrets(process.env);
  if (invalid.length > 0) {
    console.error(`Invalid production secrets: ${invalid.join(', ')}`);
    process.exit(1);
  }
}
