'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import AdvancedFormulaEditorSkeleton from '@/components/calculator/AdvancedFormulaEditorSkeleton';
import CalculatorEditorErrorState from '@/components/calculator/CalculatorEditorErrorState';
import { fetchCalculatorsAction, fetchEditCalculatorsAction } from '../../../actions/calculator/calculator';

interface IProps {
  calcId: number;
}

export const EditCalculatorDialogMobile: React.FC<IProps> = ({ calcId }) => {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ['calculators'],
    queryFn: () => fetchCalculatorsAction(id as string),
    staleTime: 0,
    gcTime: 0,
  });

  const {
    data: editData,
    isLoading: editLoading,
    isFetching: editFetching,
    error: errorLoading,
    refetch: refetchEdit,
  } = useQuery({
    queryKey: ['edit-calculators', calcId],
    queryFn: () => fetchEditCalculatorsAction(calcId as number),
    staleTime: 0,
    gcTime: 0,
  });

  const handleClose = () => {};
  const isPageLoading = isLoading || editLoading;
  const loadError = error || errorLoading;
  const isRetrying = (isFetching || editFetching) && !isPageLoading;

  if (isPageLoading) {
    return <AdvancedFormulaEditorSkeleton className="px-2 py-4" />;
  }

  if (loadError) {
    return (
      <CalculatorEditorErrorState
        error={loadError}
        onRetry={() => {
          void refetchQuestions();
          void refetchEdit();
        }}
        isRetrying={isRetrying}
        compact
        className="px-2"
      />
    );
  }

  if (!data || !editData) return null;

  return (
    <AdvancedFormulaEditor
      questionList={data}
      handleClose={handleClose}
      editList={editData}
      isEdit={calcId}
    />
  );
};

export default EditCalculatorDialogMobile;
