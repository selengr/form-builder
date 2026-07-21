'use client';

import { Fragment } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { formatContainText } from '@/lib/formatContainText';
import { TConditionData, type TConditionFormData, TSubConditionData } from '@/lib/ConditionFormSchema';
import { SubCondition } from './SubCondition';
import SubConditionDivider, { DottedLineWithDots } from './SubConditionDivider';
import { SubmitButtons } from '@/components/condition/form/SubmitButtons';
import { SelectController } from '@/components/condition/form/SelectController';
import { IConditionalSystemProps, IPostCondition } from '@/types/condition';
import { useConditionalForm } from '@/app/(builder)/builder/[id]/condition/_hooks/useConditionalForm';
import { usePostCondition } from '@/app/(builder)/builder/[id]/condition/_hooks/usePostCondition';
import { useGetQacWithOutFilter } from '@/app/(builder)/builder/[id]/condition/_hooks/useGetQacWithOutFilter';
import { useGetOnlyAllQuestions } from '@/app/(builder)/builder/[id]/condition/_hooks/useGetOnlyAllQuestions';
import { useGetOnlyAllCalculation } from '@/app/(builder)/builder/[id]/condition/_hooks/useGetOnlyAllCalculation';

const actionSelectSx = {
  flex: 1,
  minWidth: 0,
    maxHeight : '52px !important',
  width: '100% !important',
   '&.MuiInputBase-root': {
                borderRadius: '8px',
                border: 'none'
              },
};

export const ConditionalSystem: React.FC<IConditionalSystemProps> = ({
  handleClose,
  condition,
  isEdit = false,
}) => {
  const { id } = useParams();
  const router = useRouter();

  const { qacWithOutFilterOptions, isFetchingQacWithOutFilter } = useGetQacWithOutFilter();
  const { onlyAllCalculationOptions, isFetchingOnlyAllCalculation } = useGetOnlyAllCalculation();
  const {
    onlyAllQuestions,
    onlyAllDateOptions,
    onlyAllQuestionsOptions,
    onlySomeQuestionsOptions,
    isFetchingOnlyAllQuestions,
  } = useGetOnlyAllQuestions();

  const {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  } = useConditionalForm(condition);

  const postCondition = usePostCondition(isEdit);

  const onSubmit = (input: TConditionFormData) => {
    const transformInputToOutput = (input: TConditionFormData): any => {
      return input.conditions.map((condition: TConditionData, index) => {
        const { subConditions, returnQuestionId, elseQuestionId } = condition;

        const conditionFormula = subConditions
          .map((subCondition: TSubConditionData) => {
            const conditionType = subCondition.conditionType?.split('@')[0];
            const questionType = subCondition.questionType?.split('@')[0];
            const operatorType = subCondition.operatorType?.split('@')[0];
            const value =
              typeof subCondition.value !== 'object'
                ? subCondition.value?.split('@')[0]
                : subCondition.value;
            const logicalOperator = subCondition.logicalOperator?.split('@')[0];

            let formattedValue: string;

            if (operatorType === 'OPTION') {
              if (typeof subCondition.value === 'object') {
                formattedValue = `{${Array.isArray(value) && value?.map((item: string) => item?.split('@')[0])}}`;
              } else formattedValue = `{${value}}`;
            } else if (operatorType === 'VALUE') {
              formattedValue = `{#v_${value}}`;
            } else if (operatorType === 'TEXT') {
              if (conditionType === '#startWithText' || conditionType === '#endWithText') {
                const InfoField = questionType.split('*')[0];
                if (InfoField === 'INFO_FIELD') {
                  formattedValue = `{"#"}`;
                } else {
                  formattedValue = `{"${value}"}`;
                }
              } else if (conditionType === '!#containAnyText' || conditionType === '#containAnyText') {
                formattedValue = `{${formatContainText(value as string)}}`;
              } else if (
                conditionType === '#lenEqualText' ||
                conditionType === '#lenGraterThanText' ||
                conditionType === '#lenLessThanText'
              ) {
                formattedValue = `{#v_${value}}`;
              } else {
                formattedValue = value as string;
              }
            } else if (operatorType === 'DATE') {
              formattedValue = `{#v_"${value}"}`;
            } else {
              formattedValue = value as string;
            }

            const baseCondition = `${conditionType}(${questionType.split('*')[1]},${formattedValue})`;

            return logicalOperator ? ` ${logicalOperator} ${baseCondition}` : baseCondition;
          })
          .join('');

        return {
          formBuilderId: Number(id),
          conditionFormula: conditionFormula,
          elseQuestionId: (() => {
            const match = elseQuestionId.match(/\d+/);
            return match ? Number(match[0]) : null;
          })(),
          returnQuestionId: (() => {
            const match = returnQuestionId.match(/\d+/);
            return match ? Number(match[0]) : null;
          })(),
          frontConditionData: JSON.stringify(input.conditions[index]),
          ...(isEdit && { id: Number(condition.id) }),
        };
      });
    };

    const output: IPostCondition[] = transformInputToOutput(input);
    postCondition.mutate(
      { data: output },
      {
        onSuccess: async () => {
          handleClose();
          router.refresh();
        },
      },
    );
  };

  const lastSubIndex = (index: number) => conditions[index].subConditions.length - 1;

  return (
    <div dir="rtl" className="w-full flex flex-col">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-[10px]">
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
                      qacWithOutFilterOptions={qacWithOutFilterOptions}
                      isFetchingQacWithOutFilter={isFetchingQacWithOutFilter}
                      onlySomeQuestionsOptions={onlySomeQuestionsOptions}
                      isFetchingOnlyAllQuestions={isFetchingOnlyAllQuestions}
                      onlyAllCalculationOptions={onlyAllCalculationOptions}
                      isFetchingOnlyAllCalculation={isFetchingOnlyAllCalculation}
                      onlyAllQuestions={onlyAllQuestions}
                      onlyAllDateOptions={onlyAllDateOptions}
                    />
                  </Fragment>
                ))}

          <div className="p-[14px] pt-[6px] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleAddSubCondition(index, lastSubIndex(index))
                  }
                  className="w-full min-h-[52px] rounded-xl border border-dashed border-[#DDE1E6] bg-[#FAFAFA] text-[#888] text-sm font-medium hover:bg-[#F7F7FF] transition-colors"
                >
                  افزودن شرط جدید (و)
                </button>

                <div className="flex flex-col gap-1 p-1 rounded-xl bg-white">
                  <div className="flex flex-row md:items-center gap-2 md:gap-3 w-full">
                    <span className="shrink-0 w-32 h-[52px] inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#ECFDF5] text-[#379E76] text-[13px] font-semibold min-w-[72px]">
                      برو به
                    </span>
                    <SelectController
                      name={`conditions.${index}.returnQuestionId`}
                      options={onlyAllQuestionsOptions}
                      isLoading={isFetchingOnlyAllQuestions}
                      placeholder="آیتم اول"
                      sx={actionSelectSx}
                      parentStyle={actionSelectSx}
                    />
                  </div>

                  <DottedLineWithDots />
    
                  <div className="flex flex-row md:items-center gap-2 md:gap-3 w-full">
                    <span className="shrink-0 w-32 h-[52px] inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#FFFBEB] text-[#D98213] text-[13px] font-semibold min-w-[72px] whitespace-nowrap">
                      در غیر اینصورت
                    </span>
                    <SelectController
                      name={`conditions.${index}.elseQuestionId`}
                      options={onlyAllQuestionsOptions}
                      isLoading={isFetchingOnlyAllQuestions}
                      placeholder="آیتم دوم"
                      sx={actionSelectSx}
                      parentStyle={actionSelectSx}
                    />
                  </div>
                </div>
              </div>
              </div>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(index)}
                  className="self-end text-[#FA4D56] text-sm font-medium"
                >
                  حذف این شرط
                </button>
              )}
            </div>
          ))}

          {!isEdit && (
            <button
              type="button"
              onClick={handleAddCondition}
              className="w-full min-h-[52px] rounded-xl border border-dashed border-[#DDE1E6] bg-[#F8FAFC] text-[#888] text-sm font-medium hover:bg-[#F7F7FF] transition-colors"
            >
              افزودن شرط جدید
            </button>
          )}

          <SubmitButtons
            isDisabled={
              isFetchingQacWithOutFilter ||
              isFetchingOnlyAllQuestions ||
              isFetchingOnlyAllCalculation
            }
            isLoading={postCondition.isPending}
            handleClose={handleClose}
          />
        </form>
      </FormProvider>
    </div>
  );
};
