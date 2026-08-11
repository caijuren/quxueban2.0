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
    return !value || value.length < 32 || insecureValues.has(value);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const invalid = getInvalidProductionSecrets(process.env);
  if (invalid.length > 0) {
    console.error(`Invalid production secrets: ${invalid.join(', ')}`);
    process.exit(1);
  }
}
