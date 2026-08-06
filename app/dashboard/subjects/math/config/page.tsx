'use client';

import { Calculator } from 'lucide-react';
import SubjectPlanConfigEditor from '@/components/subjects/SubjectPlanConfigEditor';
import { useChildren } from '@/components/dashboard/ChildrenContext';

export default function MathPlanConfigPage() {
  const { currentChild } = useChildren();

  return (
    <SubjectPlanConfigEditor
      subject="math"
      title="数学规划配置"
      subtitle="通过表单调整 3 条线、节点、阶段目标和赛事"
      backHref="/dashboard/subjects/math"
      backLabel="返回数学学科路径"
      headerIcon={Calculator}
      childId={currentChild?.id}
      description={
        <div>
          <p className="font-medium text-text-secondary mb-1">
            本路径服务于三公冲刺路线的数学能力与竞赛荣誉
          </p>
          <p className="text-text-tertiary">
            数学学科路径是小升初方案中「三公冲刺型」路线的逻辑思维与竞赛能力支撑。核心目标：校内数学稳定
            95+、奥数七大模块掌握、AMC8 20+ 等竞赛荣誉。
          </p>
        </div>
      }
    />
  );
}
