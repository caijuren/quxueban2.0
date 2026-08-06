import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface ExamEvent {
  id: string;
  name: string;
  subject: string;
  targetGrades: string;
  date: string;
  registrationDeadline?: string;
  description: string;
  tags: string[];
}

function currentYearDate(monthDay: string): string {
  const year = new Date().getFullYear();
  return `${year}-${monthDay}`;
}

const examEvents: ExamEvent[] = [
  {
    id: 'amc8-1',
    name: 'AMC8',
    subject: '数学',
    targetGrades: '4-8年级',
    date: currentYearDate('01-23'),
    registrationDeadline: currentYearDate('12-15'),
    description: '美国数学竞赛 AMC8，25 道选择题，考查数学思维与问题解决能力。',
    tags: ['竞赛', '数学', '国际'],
  },
  {
    id: 'ket-1',
    name: 'KET',
    subject: '英语',
    targetGrades: '2-4年级',
    date: currentYearDate('04-12'),
    registrationDeadline: currentYearDate('02-28'),
    description: '剑桥英语 Key 级别，对标 A2，适合英语启蒙后第一次标化考试。',
    tags: ['剑桥', '英语', '标化'],
  },
  {
    id: 'pet-1',
    name: 'PET',
    subject: '英语',
    targetGrades: '3-5年级',
    date: currentYearDate('06-14'),
    registrationDeadline: currentYearDate('04-30'),
    description: '剑桥英语 Preliminary 级别，对标 B1，是 KET 之后的进阶目标。',
    tags: ['剑桥', '英语', '标化'],
  },
  {
    id: 'toefl-junior-1',
    name: '小托福 TOEFL Junior',
    subject: '英语',
    targetGrades: '3-5年级',
    date: currentYearDate('10-18'),
    registrationDeadline: currentYearDate('09-10'),
    description: 'ETS 青少英语能力测试，国际学校与三公备考常见参考成绩。',
    tags: ['标化', '英语', '国际'],
  },
  {
    id: 'amc8-2',
    name: 'AMC8 秋季场',
    subject: '数学',
    targetGrades: '4-8年级',
    date: currentYearDate('11-15'),
    registrationDeadline: currentYearDate('10-15'),
    description: 'AMC8 部分城市增设场次，建议提前确认所在考点安排。',
    tags: ['竞赛', '数学', '国际'],
  },
];

function sortByDate(events: ExamEvent[]) {
  const today = new Date().toISOString().split('T')[0];
  return events
    .map((e) => ({ ...e, daysUntil: Math.ceil((new Date(e.date).getTime() - new Date(today).getTime()) / 86400000) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ events: sortByDate(examEvents) });
}
