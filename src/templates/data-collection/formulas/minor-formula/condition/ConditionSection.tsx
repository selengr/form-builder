'use client';

import { Fragment, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { FormProvider } from 'react-hook-form';
import { SubCondition } from './SubCondition';
import SubConditionDivider from './SubConditionDivider';
import ConditionFormulaDemo from './ConditionFormulaDemo';
import ConditionSectionSkeleton from './ConditionSectionSkeleton';
import { useConditionalForm } from './hooks/useConditionalForm';
import { useGetQacWithOutFilter } from './hooks/useGetQacWithOutFilter';
import { useGetOnlyAllQuestions } from './hooks/useGetOnlyAllQuestions';
import { useGetOnlyAllCalculation } from './hooks/useGetOnlyAllCalculation';
import { buildConditionGroup } from './utils/buildConditionGroup';
import { conditionGroupToForm } from './utils/conditionGroupToForm';
import { FormulaConditionGroup } from '../types';

export interface ConditionSectionHandle {
  getCondition: () => Promise<FormulaConditionGroup | null>;
}

interface ConditionSectionProps {
  formId: string;
  minorId?: number | string;
  majorId?: string;
  minorName?: string;
  ref?: Ref<ConditionSectionHandle>;
  calculatorFormula?: string;
  calculatorFrontData?: string;
  initialCondition?: FormulaConditionGroup | null;
  demoContainer?: HTMLElement | null;
  onPrefilled?: () => void;
  isLoading?: boolean;
  onSelectFormRequest?: () => void;
}

const dashedButtonStyle = { minHeight: 50, color: '#9A9A9A' };

export default function ConditionSection({
  formId,
  minorId,
  majorId,
  minorName,
  ref,
  calculatorFormula,
  calculatorFrontData,
  initialCondition,
  demoContainer,
  onPrefilled,
  isLoading = false,
  onSelectFormRequest,
}: ConditionSectionProps) {
  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter } = useGetQacWithOutFilter(formId);
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation(formId);
  const {
    onlyAllQuestions,
    onlySomeQuestionsOptions,
    isFetchingOnlyAllQuestions,
  } = useGetOnlyAllQuestions(formId);

  const { methods, conditions, handleAddSubCondition, handleRemoveSubCondition } =
    useConditionalForm(undefined);

  const [isPrefilled, setIsPrefilled] = useState(false);
  const prefilledWithValueListsRef = useRef(false);
  const { isDirty } = methods.formState;
  const showSkeleton = isLoading || (initialCondition !== undefined && !isPrefilled);
  const isQuestionListReady = qacWithOutFilterOptions !== undefined || !isFetchingQacWithOutFilter;
  const areValueListsReady =
    (onlyAllQuestions !== undefined || !isFetchingOnlyAllQuestions) &&
    (onlyAllCalculationOptions !== undefined || !isFetchingOnlyAllCalculation);

  useEffect(() => {
    if (initialCondition === undefined || !isQuestionListReady) return;
    if (isPrefilled && (prefilledWithValueListsRef.current || !areValueListsReady || isDirty)) return;

    methods.reset({
      conditions: [
        conditionGroupToForm(initialCondition, {
          questionOptions: qacWithOutFilterOptions ?? [],
          onlyAllQuestions: onlyAllQuestions ?? [],
          questionValueOptions: onlySomeQuestionsOptions ?? [],
          calculationValueOptions: onlyAllCalculationOptions ?? [],
        }),
      ],
    });
    prefilledWithValueListsRef.current = areValueListsReady;

    if (!isPrefilled) {
      setIsPrefilled(true);
      onPrefilled?.();
    }
  }, [
    initialCondition,
    onPrefilled,
    isPrefilled,
    isDirty,
    isQuestionListReady,
    areValueListsReady,
    methods,
    qacWithOutFilterOptions,
    onlyAllQuestions,
    onlySomeQuestionsOptions,
    onlyAllCalculationOptions,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      getCondition: async () => {
        const isValid = await methods.trigger();
        if (!isValid) return null;

        try {
          return buildConditionGroup(methods.getValues());
        } catch (error) {
          toast.error((error as Error).message);
          return null;
        }
      },
    }),
    [methods],
  );

  const lastSubIndex = (index: number) => conditions[index].subConditions.length - 1;

  return (
    <div dir="rtl" className="w-full flex flex-col">
      <FormProvider {...methods}>
        {showSkeleton && <ConditionSectionSkeleton />}

        {!showSkeleton && conditions.map((conditionBlock, index) => (
          <div
            key={conditionBlock.id}
            className="flex flex-col w-full rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden">
            {conditionBlock.subConditions.map((subCondition, subIndex) => (
              <Fragment key={subCondition.id}>
                {subIndex > 0 && (
                  <SubConditionDivider
                    conditionIndex={index}
                    subIndex={subIndex}
                    onRemove={() => handleRemoveSubCondition(index, subIndex)}
                  />
                )}
                <SubCondition
                  index={index}
                  subIndex={subIndex}
                  qacWithOutFilterOptions={qacWithOutFilterOptions ?? []}
                  isFetchingQacWithOutFilter={isFetchingQacWithOutFilter}
                  onlySomeQuestionsOptions={onlySomeQuestionsOptions ?? []}
                  isFetchingOnlyAllQuestions={isFetchingOnlyAllQuestions}
                  onlyAllCalculationOptions={onlyAllCalculationOptions ?? []}
                  isFetchingOnlyAllCalculation={isFetchingOnlyAllCalculation}
                  onlyAllQuestions={onlyAllQuestions ?? []}
                  questionsEmptyText={formId ? 'سوالی برای این فرم یافت نشد' : 'ابتدا فرم را انتخاب کنید'}
                  onSelectFormRequest={formId ? undefined : onSelectFormRequest}
                />
              </Fragment>
            ))}

            <div style={{ padding: '3px 14px 14px' }}>
              <button
                type="button"
                onClick={() => handleAddSubCondition(index, lastSubIndex(index))}
                className="w-full rounded-xl border border-dashed border-[#DDE1E6] bg-[#F8FAFC] text-sm font-medium hover:bg-[#F7F7FF] transition-colors"
                style={dashedButtonStyle}>
                افزودن شرط جدید (و)
              </button>
            </div>
          </div>
        ))}

        {demoContainer &&
          createPortal(
            <ConditionFormulaDemo
              minorId={minorId}
              majorId={majorId}
              minorName={minorName}
              formId={formId}
              calculatorFormula={calculatorFormula}
              calculatorFrontData={calculatorFrontData}
            />,
            demoContainer,
          )}
      </FormProvider>
    </div>
  );
}
