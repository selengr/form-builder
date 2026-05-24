import ConditionList from '@/templates/condition/ConditionList';
import { getConditionListAction } from '../../../../../../actions/condition/getConditionListAction';


export default async function ConditionPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;
   const data = await getConditionListAction(String(id))

  return (
    <div className='w-full h-screen px-4 py-4'>
      <div className='md:container mx-auto flex pb-3 flex-col  min-w-screen h-full justify-start items-center bg-white rounded-xl w-full'>
        <ConditionList conditions={data} />
    </div>
    </div>
  )
}
