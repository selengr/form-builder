'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import BuilderLoading from '@/app/(builder)/builder/[id]/loading';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
// action
import { fetchCalculatorsAction, fetchEditCalculatorsAction } from '../../../actions/calculator/calculator';

interface IProps {
  calcId: number;
}

export const EditCalculatorDialogMobile: React.FC<IProps> = ({ calcId }) => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['calculators'],
    queryFn: () => fetchCalculatorsAction(id as string),
    staleTime: 0,
    gcTime: 0,
  });

    const {
      data: editData,
      isLoading: editLoading,
      error: errorLoading,
    } = useQuery({
      queryKey: ['edit-calculators'],
      queryFn: () => fetchEditCalculatorsAction(calcId as number),
      staleTime: 0,
      gcTime: 0,
    });

    const handleClose = () => { };

    return (
      <>
        {isLoading ||
          (editLoading && (
            <div className='flex flex-col items-center justify-center w-full h-full min-w-[600px] min-h-[300px] bg-white bg-opacity-80 border border-gray-300 rounded-lg shadow-lg'>
              <p>در حال بارگیری محاسبه‌گر...</p>
              {/* <BuilderLoading className='min-h-16' /> */}
            </div>
          ))}
        {error && <p>Error loading calculators: {(error as Error).message}</p>}
        {data && editData && <AdvancedFormulaEditor questionList={data} handleClose={handleClose} editList={editData} isEdit={calcId} />}
      </>
    );
  };

  export default EditCalculatorDialogMobile;
