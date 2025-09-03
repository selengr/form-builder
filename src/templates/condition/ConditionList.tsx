'use client';
// lib
import { idGenerator } from '@/lib';
// hooks
import { useFormData } from '@/hooks';
// types
import { IGetCondition } from '@/types/condition';
// view
import { ConditionCard } from './ConditionCard';
import CreateCondition from './CreateCondition';
import { useGetQacWithOutFilterList } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilterList';

interface IProps {
  conditions: IGetCondition[];
}

const ConditionList: React.FC<IProps> = ({ conditions }) => {
  const { formData, isLoading } = useFormData();
  const { qacWithOutFilterOptions } = useGetQacWithOutFilterList();

  return (
    <>
      <div className='w-full max-w-[530px] -mr-3'>{formData?.formSettingModel?.formStatus === 'CREATE' && <CreateCondition />}</div>
      <div dir='rtl' className='w-full overflow-y-auto h-full flex justify-center'>
        <div className='w-full max-w-[520px] flex flex-col p-[13px]'>
          {Array.isArray(conditions) && conditions.length > 0 && (
            <div dir='rtl' className='bg-[#F7F7FF] rounded-lg p-[10px] w-full flex flex-col gap-3  mb-10'>
              {conditions?.map((condition: IGetCondition, index: number) => (
                <ConditionCard  qacWithOutFilterOptions={qacWithOutFilterOptions} 
                key={idGenerator()} condition={condition} index={index} disabled={isLoading || formData?.formSettingModel?.formStatus !== 'CREATE'} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConditionList;
