import ConditionList from '@/templates/condition/ConditionList';
import { getFormDataAction } from '../../../../../../actions/calculator/calculation';
import { getConditionListAction } from '../../../../../../actions/condition/getConditionListAction';

export const revalidate = 300; 

export default async function ConditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return <div>آیدی نامعتبر است</div>;

  const formData = await getFormDataAction(id)
  const data = await getConditionListAction(id)

  return (
    <ConditionList conditions={data} formData={formData} />
  )
}
