import 'dotenv/config';
import { PrismaClient, UserRole } from '../lib/generated/prisma';
import bcrypt from 'bcryptjs';
import {
  generateWeeklyPlan,
  getCurrentWeekId,
} from '../lib/weeklyTasks';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // 1. Admin user
  let admin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!admin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    admin = await prisma.user.create({
      data: {
        username: adminUsername,
        passwordHash,
        name: '管理员',
        role: UserRole.ADMIN,
      },
    });
    console.log(`Created admin user: ${adminUsername}`);
  } else {
    console.log(`Admin user already exists: ${adminUsername}`);
  }

  // 2. Demo parent user
  const demoParentUsername = process.env.DEMO_PARENT_USERNAME || 'parent';
  const demoParentPassword = process.env.DEMO_PARENT_PASSWORD || 'parent123';

  let parent = await prisma.user.findUnique({
    where: { username: demoParentUsername },
  });

  if (!parent) {
    const passwordHash = await bcrypt.hash(demoParentPassword, 12);
    parent = await prisma.user.create({
      data: {
        username: demoParentUsername,
        passwordHash,
        name: 'demo家长',
        role: UserRole.PARENT,
      },
    });
    console.log(`Created demo parent user: ${demoParentUsername}`);
  } else {
    console.log(`Demo parent user already exists: ${demoParentUsername}`);
  }

  // 3. Demo children
  const existingChildren = await prisma.child.findMany({
    where: { userId: parent.id },
  });

  let dabao = existingChildren.find((c) => c.name === '大宝');
  let xiaobao = existingChildren.find((c) => c.name === '小宝');

  if (!dabao) {
    dabao = await prisma.child.create({
      data: {
        userId: parent.id,
        name: '大宝',
        grade: 6,
        avatarColor: '#f43f5e',
        targetSchool: '交大附中嘉定分校',
      },
    });
    console.log(`Created child: 大宝 (grade 6)`);
  }

  if (!xiaobao) {
    xiaobao = await prisma.child.create({
      data: {
        userId: parent.id,
        name: '小宝',
        grade: 1,
        avatarColor: '#06b6d4',
        targetSchool: null,
      },
    });
    console.log(`Created child: 小宝 (grade 1)`);
  }

  // 4. Demo weekly plan for current week (published)
  const weekId = getCurrentWeekId();
  const existingPlan = await prisma.weeklyPlan.findUnique({
    where: { childId_weekId: { childId: dabao.id, weekId } },
  });

  if (!existingPlan) {
    const weeklyPlan = generateWeeklyPlan(
      {
        id: dabao.id,
        name: dabao.name,
        grade: dabao.grade,
        avatarColor: dabao.avatarColor,
      },
      weekId
    );

    await prisma.weeklyPlan.create({
      data: {
        userId: parent.id,
        childId: dabao.id,
        weekId: weeklyPlan.weekId,
        tasks: weeklyPlan.tasks as any,
        publishedAt: new Date(),
      },
    });
    console.log(`Created weekly plan for ${dabao.name}: ${weekId}`);
  } else {
    console.log(`Weekly plan already exists for ${dabao.name}: ${weekId}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
