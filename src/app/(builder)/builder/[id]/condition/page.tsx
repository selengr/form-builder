import ConditionList from '@/templates/condition/ConditionList';
import { getConditionListAction } from '../../../../../../actions/condition/getConditionListAction';


export default async function ConditionPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

    if (!id) return <div>آیدی نامعتبر است</div>;

   const data = await getConditionListAction(id)

  return (
        <ConditionList conditions={data} />
    
  )
}
