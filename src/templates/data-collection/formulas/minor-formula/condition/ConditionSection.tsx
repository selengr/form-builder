'use client';

import { Fragment, Ref, useImperativeHandle } from 'react';
import { FormProvider } from 'react-hook-form';
import { SubCondition } from './SubCondition';
import SubConditionDivider from './SubConditionDivider';
import { useConditionalForm } from './hooks/useConditionalForm';
import { useGetQacWithOutFilter } from './hooks/useGetQacWithOutFilter';
import { useGetOnlyAllQuestions } from './hooks/useGetOnlyAllQuestions';
import { useGetOnlyAllCalculation } from './hooks/useGetOnlyAllCalculation';
import { transformConditions } from './utils/transformConditions';
import { IPostCondition } from './types';

export interface ConditionSectionHandle {
  validate: () => Promise<IPostCondition[] | null>;
}

interface ConditionSectionProps {
  formId: string;
  ref?: Ref<ConditionSectionHandle>;
}

const dashedButtonStyle = { minHeight: 50, color: '#9A9A9A' };

export default function ConditionSection({ formId, ref }: ConditionSectionProps) {
  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter } = useGetQacWithOutFilter(formId);
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation(formId);
  const {
    onlyAllQuestions,
    onlyAllDateOptions,
    onlySomeQuestionsOptions,
    isFetchingOnlyAllQuestions,
  } = useGetOnlyAllQuestions(formId);

  const { methods, conditions, handleAddSubCondition, handleRemoveSubCondition } =
    useConditionalForm(undefined, formId);

  useImperativeHandle(
    ref,
    () => ({
      validate: async () => {
        const isValid = await methods.trigger();
        if (!isValid) return null;
        return transformConditions(methods.getValues(), formId);
      },
    }),
    [methods, formId],
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
                  onlyAllDateOptions={onlyAllDateOptions ?? []}
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
      </FormProvider>
    </div>
  );
}
