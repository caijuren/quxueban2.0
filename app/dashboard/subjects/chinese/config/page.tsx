'use client';

import SubjectPlanConfigEditor from '@/components/subjects/SubjectPlanConfigEditor';
import { useChildren } from '@/components/dashboard/ChildrenContext';

export default function ChinesePlanConfigPage() {
  const { currentChild } = useChildren();

  return (
    <SubjectPlanConfigEditor
      subject="chinese"
      title="语文规划配置"
      subtitle="通过表单调整 6 条线、节点、阶段目标和赛事"
      backHref="/dashboard/subjects/chinese"
      backLabel="返回语文学科路径"
      headerIcon="BookOpen"
      childId={currentChild?.id}
      description={
        <div>
          <p className="mb-1 font-medium text-text-secondary">
            本路径服务于三公冲刺路线的语文素养与综合荣誉
          </p>
          <p className="text-text-tertiary">
            语文学科路径是小升初方案中「三公冲刺型」路线的人文素养与面谈表达支撑。核心目标：古诗文积累
            120 首+、汉字小达人/古诗文大会荣誉、流畅自信的面谈表达。
          </p>
        </div>
      }
    />
  );
}
