'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AxiosApi } from '@/services/axios/AxiosApi';

import BuilderLoading from '@/app/(builder)/builder/[id]/loading';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';


interface IProps {
  calcId: number;
}

const fetchCalculators = async (id: string) => {
  const customComboFilterModel = {
    type: 'COMBO',
    entity: 'QUESTIONS',
    mode: 'QUESTIONS_IN_FORM_BUILDER__ALL',
    input: '',
    page: 0,
    rows: 10000,
    extMap: {
      formId: id,
      typeRequest: 'QAC_BY_FILTER',
    },
  };
  const url = `/question/q-and-c-custom-combo?customComboFilterModel=${encodeURIComponent(JSON.stringify(customComboFilterModel))}`;
  const response = await AxiosApi.get(url);
  return response.data;
};

const fetchEditCalculators = async (calcId: number) => {
  const url = `/calculation/main-list/find/${calcId}`;
  const response = await AxiosApi.get(url);
  return response.data;
};

export const EditCalculatorDialogMobile: React.FC<IProps> = ({ calcId }) => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['calculators'],
    queryFn: () => fetchCalculators(id as string),
    staleTime: 0,
    gcTime: 0,
  });

    const {
      data: editData,
      isLoading: editLoading,
      error: errorLoading,
    } = useQuery({
      queryKey: ['edit-calculators'],
      queryFn: () => fetchEditCalculators(calcId as number),
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
              <BuilderLoading className='min-h-16' />
            </div>
          ))}
        {error && <p>Error loading calculators: {(error as Error).message}</p>}
        {data && editData && <AdvancedFormulaEditor questionList={data} handleClose={handleClose} editList={editData} isEdit={calcId} />}
      </>
    );
  };

  export default EditCalculatorDialogMobile;
