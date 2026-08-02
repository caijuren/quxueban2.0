import 'dotenv/config';
import { PrismaClient, UserRole } from '../lib/generated/prisma';
import bcrypt from 'bcryptjs';
import {
  generateWeeklyPlan,
  getCurrentWeekId,
} from '../lib/weeklyTasks';
import { seedSystemTaskTemplatesForUser } from '../lib/seedTaskTemplates';
import { seedSystemCapabilities } from '../lib/seedCapabilities';
import { seedSystemSubjectPlans } from '../lib/seedSubjectPlans';
import { seedBooks } from '../lib/seedBooks';
import { type EducationSystem } from '../lib/children';

const prisma = new PrismaClient();

async function main() {
  // Seed system capabilities first
  const seededCapabilities = await seedSystemCapabilities(prisma);
  if (seededCapabilities > 0) {
    console.log(`Seeded ${seededCapabilities} system capabilities`);
  }

  // Seed system subject plan configs
  const seededSubjectPlans = await seedSystemSubjectPlans(prisma);
  if (seededSubjectPlans > 0) {
    console.log(`Seeded ${seededSubjectPlans} system subject plan configs`);
  }

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

  // 1b. Seed system task templates for admin
  const adminTemplatesCount = await seedSystemTaskTemplatesForUser(prisma, admin.id);
  if (adminTemplatesCount > 0) {
    console.log(`Seeded ${adminTemplatesCount} system task templates for admin`);
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

  // 2b. Seed system task templates for demo parent
  const parentTemplatesCount = await seedSystemTaskTemplatesForUser(prisma, parent.id);
  if (parentTemplatesCount > 0) {
    console.log(`Seeded ${parentTemplatesCount} system task templates for demo parent`);
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
        routeId: 'zhongkao_putong',
      },
    });
    console.log(`Created child: 大宝 (grade 6)`);
  } else if (!dabao.routeId) {
    dabao = await prisma.child.update({
      where: { id: dabao.id },
      data: { routeId: 'zhongkao_putong' },
    });
    console.log(`Updated child route: 大宝 -> zhongkao_putong`);
  }

  if (!xiaobao) {
    xiaobao = await prisma.child.create({
      data: {
        userId: parent.id,
        name: '小宝',
        grade: 1,
        avatarColor: '#06b6d4',
        targetSchool: null,
        routeId: 'sanchu_gongban',
      },
    });
    console.log(`Created child: 小宝 (grade 1)`);
  } else if (!xiaobao.routeId) {
    xiaobao = await prisma.child.update({
      where: { id: xiaobao.id },
      data: { routeId: 'sanchu_gongban' },
    });
    console.log(`Updated child route: 小宝 -> sanchu_gongban`);
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
        educationSystem: dabao.educationSystem as EducationSystem,
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

  // 5. Seed teaching-aid books
  const bookStats = await seedBooks(prisma);
  if (bookStats.created + bookStats.updated > 0) {
    console.log(`Seeded teaching-aid books: ${bookStats.created} created, ${bookStats.updated} updated`);
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
