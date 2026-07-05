'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { IoIosArrowForward } from 'react-icons/io';
import AdvancedFormulaEditor from '@/components/calculator/AdvancedFormulaEditor';
import AdvancedFormulaEditorSkeleton from '@/components/calculator/AdvancedFormulaEditorSkeleton';
import CalculatorEditorErrorState from '@/components/calculator/CalculatorEditorErrorState';
import { ConditionalSystem } from '@/templates/condition/ConditionalSystem';
import {
  fetchCalculatorsAction,
  fetchEditCalculatorsAction,
} from '../../../../actions/calculator/calculator';
import { LogicFormState } from './types';

interface LogicFormPanelProps {
  formState: NonNullable<LogicFormState>;
  onBack: () => void;
  onSuccess: () => void;
}

export default function LogicFormPanel({
  formState,
  onBack,
  onSuccess,
}: LogicFormPanelProps) {
  const { id } = useParams();

  const handleClose = () => {
    onSuccess();
    onBack();
  };

  const isCalculator = formState.type === 'calculator';
  const calcId = isCalculator && formState.mode === 'edit' ? formState.id : undefined;

  const {
    data: questionList,
    isLoading: questionsLoading,
    isFetching: questionsFetching,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ['calculators', id],
    queryFn: () => fetchCalculatorsAction(id as string),
    enabled: isCalculator && !!id,
  });

  const {
    data: editData,
    isLoading: editLoading,
    isFetching: editFetching,
    error: editError,
    refetch: refetchEdit,
  } = useQuery({
    queryKey: ['edit-calculators', calcId],
    queryFn: () => fetchEditCalculatorsAction(calcId as number),
    enabled: isCalculator && formState.mode === 'edit' && !!calcId,
  });

  const title =
    formState.type === 'calculator'
      ? formState.mode === 'create'
        ? 'محاسبه‌گر جدید'
        : 'ویرایش محاسبه‌گر'
      : 'تعریف شرط';

  const isLoading =
    isCalculator && (questionsLoading || (formState.mode === 'edit' && editLoading));
  const loadError = isCalculator ? questionsError || editError : null;
  const isRetrying =
    isCalculator && (questionsFetching || editFetching) && !isLoading;

  const handleRetry = () => {
    void refetchQuestions();
    if (formState.mode === 'edit') void refetchEdit();
  };

  return (
    <div dir="rtl" className="flex flex-col h-full min-h-0 px-1">
      <div className="flex items-center gap-2 pb-3 shrink-0 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 text-[#2A2A2A]"
          aria-label="بازگشت"
        >
          <IoIosArrowForward size={22} />
        </button>
        <h2 className="text-[16px] font-bold text-[#161616]">{title}</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {isLoading && <AdvancedFormulaEditorSkeleton className="px-1 pb-4" />}

        {loadError && !isLoading && (
          <CalculatorEditorErrorState
            error={loadError}
            onRetry={handleRetry}
            onClose={onBack}
            closeLabel="بازگشت"
            isRetrying={isRetrying}
            compact
          />
        )}

        {isCalculator && questionList && formState.mode === 'create' && !isLoading && !loadError && (
          <AdvancedFormulaEditor questionList={questionList} handleClose={handleClose} />
        )}

        {isCalculator &&
          questionList &&
          editData &&
          formState.mode === 'edit' &&
          !isLoading &&
          !loadError && (
            <AdvancedFormulaEditor
              questionList={questionList}
              handleClose={handleClose}
              editList={editData}
              isEdit={formState.id}
            />
          )}

        {formState.type === 'condition' && (
          <ConditionalSystem
            handleClose={handleClose}
            condition={formState.mode === 'edit' ? formState.condition : undefined}
            isEdit={formState.mode === 'edit'}
          />
        )}
      </div>
    </div>
  );
}
