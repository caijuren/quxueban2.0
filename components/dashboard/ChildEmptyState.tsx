'use client';

import { useState } from 'react';
import { User, Plus } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import ChildModal from '@/components/dashboard/ChildModal';

interface ChildEmptyStateProps {
  description?: string;
}

export default function ChildEmptyState({
  description = '添加孩子后，系统会根据年级展示对应的升学内容与工具',
}: ChildEmptyStateProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <EmptyState
        icon={User}
        title="还没有孩子档案"
        description={description}
        action={{
          label: '添加孩子',
          onClick: () => setModalOpen(true),
        }}
      />
      <ChildModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
