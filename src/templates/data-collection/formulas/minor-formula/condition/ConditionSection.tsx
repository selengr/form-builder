'use client';

import { Fragment, Ref, useImperativeHandle } from 'react';
import { FormProvider } from 'react-hook-form';
import { SubCondition } from './SubCondition';
import SubConditionDivider, { DottedLineWithDots } from './SubConditionDivider';
import { SelectController } from './form/SelectController';
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

const actionSelectSx = {
  flex: 1,
  minWidth: 0,
  maxHeight: '52px !important',
  width: '100% !important',
};

const dashedButtonStyle = { minHeight: 50, color: '#9A9A9A' };

export default function ConditionSection({ formId, ref }: ConditionSectionProps) {
  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter } = useGetQacWithOutFilter(formId);
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation(formId);
  const {
    onlyAllQuestions,
    onlyAllDateOptions,
    onlyAllQuestionsOptions,
    onlySomeQuestionsOptions,
    isFetchingOnlyAllQuestions,
  } = useGetOnlyAllQuestions(formId);

  const {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  } = useConditionalForm(undefined, formId);

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
        <div className="flex flex-col gap-3">
          {conditions.map((conditionBlock, index) => (
            <div key={conditionBlock.id} className="flex flex-col gap-3">
              <div className="flex flex-col w-full rounded-2xl border border-[#DDE1E6] bg-[#F8FAFC] overflow-hidden">
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

                <div className="flex flex-col" style={{ padding: '3px 14px 14px', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleAddSubCondition(index, lastSubIndex(index))}
                    className="w-full rounded-xl border border-dashed border-[#DDE1E6] bg-[#F8FAFC] text-sm font-medium hover:bg-[#F7F7FF] transition-colors"
                    style={dashedButtonStyle}>
                    افزودن شرط جدید (و)
                  </button>

                  <div className="flex flex-col p-1 rounded-xl bg-white">
                    <div className="flex flex-row md:items-center gap-2 md:gap-3 w-full">
                      <span
                        className="shrink-0 h-[52px] inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#379E76] text-[13px] font-semibold"
                        style={{ width: 118 }}>
                        برو به
                      </span>
                      <SelectController
                        name={`conditions.${index}.returnQuestionId`}
                        options={onlyAllQuestionsOptions ?? []}
                        isLoading={isFetchingOnlyAllQuestions}
                        placeholder="آیتم اول"
                        sx={actionSelectSx}
                        parentStyle={actionSelectSx}
                        contentInset="22.8px"
                        iconInset="14px"
                        borderless
                      />
                    </div>

                    <DottedLineWithDots />

                    <div className="flex flex-row md:items-center gap-2 md:gap-3 w-full">
                      <span
                        className="shrink-0 h-[52px] inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#FFFBEB] text-[#D98213] text-[13px] font-semibold whitespace-nowrap"
                        style={{ width: 118 }}>
                        در غیر اینصورت
                      </span>
                      <SelectController
                        name={`conditions.${index}.elseQuestionId`}
                        options={onlyAllQuestionsOptions ?? []}
                        isLoading={isFetchingOnlyAllQuestions}
                        placeholder="آیتم دوم"
                        sx={actionSelectSx}
                        parentStyle={actionSelectSx}
                        contentInset="22.8px"
                        iconInset="14px"
                        borderless
                      />
                    </div>
                  </div>
                </div>
              </div>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(index)}
                  className="self-end text-[#FA4D56] text-sm font-medium">
                  حذف این شرط
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCondition}
            className="w-full rounded-xl border border-dashed border-[#DDE1E6] bg-[#F8FAFC] text-sm font-medium hover:bg-[#F7F7FF] transition-colors"
            style={dashedButtonStyle}>
            افزودن شرط جدید
          </button>
        </div>
      </FormProvider>
    </div>
  );
}
