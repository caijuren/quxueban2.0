import { plans, middleSchoolPlans } from '@/lib/plans';
import PlanDetailClient from './PlanDetailClient';

export function generateStaticParams() {
  return [...plans, ...middleSchoolPlans].map((plan) => ({ id: plan.id }));
}

export default function PlanDetailPage({ params }: { params: { id: string } }) {
  return <PlanDetailClient id={params.id} />;
}
