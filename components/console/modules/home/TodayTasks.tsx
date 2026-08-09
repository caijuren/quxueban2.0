'use client';

import { Icon, type IconName } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Section from '@/components/console/core/Section';

interface Task {
  id: string;
  title: string;
  subject: string;
  progress: number;
  icon: IconName;
}

const mockTasks: Task[] = [
  { id: '1', title: '数学训练', subject: 'math', progress: 80, icon: 'Target' },
  { id: '2', title: '阅读任务', subject: 'chinese', progress: 100, icon: 'BookOpen' },
  { id: '3', title: '英语听力', subject: 'english', progress: 30, icon: 'Headphones' },
];

const subjectColors: Record<string, string> = {
  math: 'bg-primary',
  chinese: 'bg-success',
  english: 'bg-ai',
};

export default function TodayTasks() {
  return (
    <Section title="今日学习" description="今天需要完成的学习任务">
      <div className="space-y-3 p-2">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 rounded-xl bg-surface-hover p-3 transition-colors hover:bg-surface-hover"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
              <Icon name={task.icon} size="md" className="text-text-tertiary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">{task.title}</p>
                <span className="text-xs text-text-muted">{task.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${subjectColors[task.subject]}`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="md" className="bg-primary/[0.08] hover:bg-primary/[0.12] w-full rounded-xl py-2.5 text-sm font-medium text-primary transition-colors">
          继续学习 →
        </Button>
      </div>
    </Section>
  );
}
