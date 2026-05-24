'use client';
// types
import { IGetCondition } from '@/types/condition';
// view
import { ConditionCard } from './ConditionCard';
import CreateCondition from './CreateCondition';
import { useGetQacWithOutFilterList } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilterList';

interface IProps {
  formData: {
    formSettingModel: {
      formStatus: string
    };
  }
  conditions: IGetCondition[];
}

const ConditionList: React.FC<IProps> = ({ conditions, formData }) => {
  const { qacWithOutFilterOptions } = useGetQacWithOutFilterList();

  const isCreateMode = formData?.formSettingModel?.formStatus === 'CREATE';

  return (
    <>
        <div className="w-full max-w-[530px] -mr-3">
          <CreateCondition isCreateMode={isCreateMode}/>
        </div>
      <div dir='rtl' className='w-full overflow-y-auto h-full flex justify-center'>
        <div className='w-full max-w-[520px] flex flex-col p-0 md:p-[13px]'>
          {Array.isArray(conditions) && conditions.length > 0 && (
            <div dir='rtl' className='bg-[#F7F7FF] rounded-lg p-0 md:p-[10px] w-full flex flex-col gap-3  mb-10'>
              {conditions?.map((condition: IGetCondition, index: number) => (
                <ConditionCard qacWithOutFilterOptions={qacWithOutFilterOptions}
                  key={condition.id} condition={condition} index={index} disabled={!isCreateMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConditionList;