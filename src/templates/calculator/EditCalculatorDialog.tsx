'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { IEditCalculatorDialogProps } from '@/types/calculator';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import { CalculatorEditorDialogSkeleton } from '@/components/calculator/AdvancedFormulaEditorSkeleton';
import CalculatorEditorErrorState from '@/components/calculator/CalculatorEditorErrorState';
import CalculatorDialogShell from './CalculatorDialogShell';
import { fetchCalculatorsAction, fetchEditCalculatorsAction } from '../../../actions/calculator/calculator';

export const EditCalculatorDialog: React.FC<IEditCalculatorDialogProps> = ({
  open,
  setOpen,
  calcId,
}) => {
  const { id } = useParams();
  const handleClose = () => setOpen(false);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ['calculators', id],
    queryFn: () => fetchCalculatorsAction(id as string),
    enabled: open && !!id,
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
    enabled: open && !!calcId,
    staleTime: 0,
    gcTime: 0,
  });

  const isPageLoading = isLoading || editLoading;
  const loadError = error || errorLoading;
  const isRetrying = (isFetching || editFetching) && !isPageLoading;

  const handleRetry = () => {
    void refetchQuestions();
    void refetchEdit();
  };

  return (
    <CalculatorDialogShell open={open} onClose={handleClose}>
      {isPageLoading && <CalculatorEditorDialogSkeleton />}

      {loadError && !isPageLoading && (
        <CalculatorEditorErrorState
          error={loadError}
          onRetry={handleRetry}
          onClose={handleClose}
          isRetrying={isRetrying}
        />
      )}

      {data && editData && !isPageLoading && !loadError && (
        <AdvancedFormulaEditor
          questionList={data}
          handleClose={handleClose}
          editList={editData}
          isEdit
        />
      )}
    </CalculatorDialogShell>
  );
};

export default EditCalculatorDialog;
