'use client';

import { CgClose } from 'react-icons/cg';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { ICreateCalculatorDialogProps, IFieldQuestionData } from '@/types/calculator';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import { CalculatorEditorDialogSkeleton } from '@/components/calculator/AdvancedFormulaEditorSkeleton';
import CalculatorEditorErrorState from '@/components/calculator/CalculatorEditorErrorState';
import CalculatorDialogShell from './CalculatorDialogShell';
import { fetchCalculatorsAction } from '../../../actions/calculator/calculator';

const CreateCalculatorDialog: React.FC<ICreateCalculatorDialogProps> = ({ open, setOpen }) => {
  const { id } = useParams();
  const handleClose = () => setOpen(false);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['calculators', id],
    queryFn: () => fetchCalculatorsAction(id as string),
    enabled: open && !!id,
    gcTime: 10 * 60 * 1000,
    retry: 3
  });


  return (
    <CalculatorDialogShell open={open} onClose={handleClose}>
      {isLoading && <CalculatorEditorDialogSkeleton />}

      {error && (
        <CalculatorEditorErrorState
          error={error}
          onRetry={() => refetch()}
          onClose={handleClose}
          isRetrying={isFetching && !isLoading}
        />
      )}

      {data && !isLoading && !error && (
        <AdvancedFormulaEditor questionList={data} handleClose={handleClose} />
      )}
    </CalculatorDialogShell>
  );
};

export default CreateCalculatorDialog;
