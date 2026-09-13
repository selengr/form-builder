'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import AdvancedFormulaEditorSkeleton from '@/components/calculator/AdvancedFormulaEditorSkeleton';
import CalculatorEditorErrorState from '@/components/calculator/CalculatorEditorErrorState';
import { fetchCalculatorsAction } from '../../../actions/calculator/calculator';

export const CreateCalculatorMobile = () => {
  const { id } = useParams();
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['calculators'],
    queryFn: async () => {
      const res = await fetchCalculatorsAction(id as string);

      if (!res.success) {
        throw new Error(res.message || 'انجام عملیات با خطا مواجه شد');
      }

      return res.data;
    },
    staleTime: 0,
    gcTime: 600000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const handleClose = () => {};

  if (isLoading) {
    return <AdvancedFormulaEditorSkeleton className="px-2 py-4" />;
  }

  if (error) {
    return (
      <CalculatorEditorErrorState
        error={error}
        onRetry={() => refetch()}
        isRetrying={isFetching && !isLoading}
        compact
        className="px-2"
      />
    );
  }

  if (!data) return null;

  return <AdvancedFormulaEditor questionList={data} handleClose={handleClose} />;
};

export default CreateCalculatorMobile;
