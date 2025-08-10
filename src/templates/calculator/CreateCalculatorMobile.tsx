'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { AxiosApi } from '@/services/axios/AxiosApi';

import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';


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

export const CreateCalculatorMobile = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['calculators'],
    queryFn: () => fetchCalculators(id as string),
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const handleClose = () => {

  };

  return (

    <>
      {isLoading && <p>Loading calculators...</p>}
      {error && <p>Error loading calculators: {(error as Error).message}</p>}
      {data && <AdvancedFormulaEditor questionList={data} handleClose={handleClose} />}

    </>
  );
};

export default CreateCalculatorMobile;
