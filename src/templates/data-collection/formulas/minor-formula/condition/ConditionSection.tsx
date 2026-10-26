'use client';

import { Fragment, Ref, useEffect, useImperativeHandle, useRef } from 'react';
import { toast } from 'sonner';
import { FormProvider } from 'react-hook-form';
import { SubCondition } from './SubCondition';
import SubConditionDivider from './SubConditionDivider';
import ConditionFormulaDemo from './ConditionFormulaDemo';
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
    useConditionalForm(undefined, formId);

  const hasPrefilledRef = useRef(false);
  const areSourcesReady =
    !isFetchingQacWithOutFilter && !isFetchingOnlyAllQuestions && !isFetchingOnlyAllCalculation;

  useEffect(() => {
    if (!initialCondition || hasPrefilledRef.current || !areSourcesReady) return;
    hasPrefilledRef.current = true;
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
  }, [
    initialCondition,
    areSourcesReady,
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
        {conditions.map((conditionBlock, index) => (
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

        <ConditionFormulaDemo
          minorId={minorId}
          majorId={majorId}
          minorName={minorName}
          formId={formId}
          calculatorFormula={calculatorFormula}
          calculatorFrontData={calculatorFrontData}
        />
      </FormProvider>
    </div>
  );
}
