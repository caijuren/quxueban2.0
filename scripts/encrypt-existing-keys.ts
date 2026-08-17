import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma';
import { encryptSecret, isEncrypted } from '../lib/crypto';

const prisma = new PrismaClient();

async function main() {
  const configs = await prisma.aiConfig.findMany();
  let migrated = 0;
  for (const config of configs) {
    if (!config.apiKey || isEncrypted(config.apiKey)) continue;
    await prisma.aiConfig.update({
      where: { id: config.id },
      data: { apiKey: encryptSecret(config.apiKey) },
    });
    migrated += 1;
  }
  console.log(
    `已加密 ${migrated} 条 AiConfig 记录（共 ${configs.length} 条，已加密/空值已跳过）`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
