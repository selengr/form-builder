import { serverApi } from '@/services/axios/serverApi';
import ConditionList from '@/templates/condition/ConditionList';
import { getConditionListAction } from '../../../../../../actions/condition/getConditionListAction';

export const revalidate = 300; 

async function getFormDataAction(id: string) {
    const response = await serverApi.get(`/form/${id}`);
    return response.data;
}

export default async function ConditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return <div>آیدی نامعتبر است</div>;

  const formData = await getFormDataAction(id)
  const data = await getConditionListAction(id)

  return (
    <ConditionList conditions={data} formData={formData} />
  )
}
