'use client';

import { Languages } from 'lucide-react';
import SubjectPlanConfigEditor from '@/components/subjects/SubjectPlanConfigEditor';
import { useChildren } from '@/components/dashboard/ChildrenContext';

export default function EnglishPlanConfigPage() {
  const { currentChild } = useChildren();

  return (
    <SubjectPlanConfigEditor
      subject="english"
      title="英语规划配置"
      subtitle="通过表单调整 3 条线、节点、阶段目标和赛事"
      backHref="/dashboard/subjects/english"
      backLabel="返回英语学科路径"
      headerIcon={Languages}
      childId={currentChild?.id}
      description={
        <div>
          <p className="font-medium text-text-secondary mb-1">
            本路径服务于三公冲刺路线的英语能力与证书荣誉
          </p>
          <p className="text-text-tertiary">
            英语学科路径是小升初方案中「三公冲刺型」路线的底层能力支撑。核心目标：三年级 KET 卓越、四年级
            PET 卓越、五年级上小托福 850+。
          </p>
        </div>
      }
    />
  );
}
