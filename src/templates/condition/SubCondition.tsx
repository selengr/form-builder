'use client';

import { Fragment } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { getCondition, getInput, getQuestion } from './GetConditionInput';
import { SelectController } from '@/components/condition/form/SelectController';

type SubConditionProps = {
  index: number;
  subIndex: number;
  qacWithOutFilterOptions: any[];
  isFetchingQacWithOutFilter: boolean;
  onlySomeQuestionsOptions: any[];
  isFetchingOnlyAllQuestions: boolean;
  onlyAllCalculationOptions: any[];
  isFetchingOnlyAllCalculation: boolean;
  onlyAllQuestions: any[];
  onlyAllDateOptions: any[];
};

const fieldSx = {
  width: '100%',
  // minWidth: 0,
    maxHeight : '52px !important',
  flex: 1,
  backgroundColor : "white"
};

export const SubCondition: React.FC<SubConditionProps> = ({
  index,
  subIndex,
  qacWithOutFilterOptions,
  isFetchingQacWithOutFilter,
  onlySomeQuestionsOptions,
  isFetchingOnlyAllQuestions,
  onlyAllCalculationOptions,
  isFetchingOnlyAllCalculation,
  onlyAllQuestions,
  onlyAllDateOptions,
}) => {
  const { control, setValue, getValues } = useFormContext();
  const currentValues = useWatch({
    control,
    name: `conditions.${index}.subConditions.${subIndex}`,
  });

  const valueInput = getInput(
    currentValues.questionType,
    currentValues.operatorType,
    currentValues.conditionType,
    { name: `conditions.${index}.subConditions.${subIndex}.value` },
    {
      onlySomeQuestionsOptions,
      isFetchingOnlyAllQuestions,
      onlyAllCalculationOptions,
      isFetchingOnlyAllCalculation,
      onlyAllQuestions,
      onlyAllDateOptions,
      control,
      setValue,
    },
  );

  return (
    <div className="flex flex-col gap-3">
      {subIndex === 0 && (
        <p className="text-[14px] bg-white p-[14px] border-b border-b-[#DDE1E6] font-medium text-[#393939] text-right">اگر</p>
      )}

      <div className="text-[14px] flex flex-col py-[6px] px-[14px] md:flex-row gap-3 md:items-start w-full">
        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.questionType`}
          options={qacWithOutFilterOptions}
          isLoading={isFetchingQacWithOutFilter}
          placeholder="بر اساس"
          sx={{...fieldSx, width: {xs : "100%" , md : 320}}}
          onChange={(e: any) => {
            const combinedKey = `${e.target?.value?.split('*')[0]}`;
            if (combinedKey === 'INFO_FIELD') {
              setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, 'TEXT');
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '#startWithText');
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '---');
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, '');
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '');
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
        />

        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.operatorType`}
          options={getQuestion(currentValues.questionType, currentValues)}
          placeholder="گویه"
          sx={{...fieldSx, width: {xs : "100%" , md : 120}}}
          onChange={() => {
            const questionType = getValues(`conditions.${index}.subConditions.${subIndex}.questionType`);
            const combinedKey = `${questionType?.split('*')[0]}`;
            if (combinedKey === 'INFO_FIELD') {
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '#startWithText');
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '---');
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '');
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
          isOperator
          disabled={!currentValues.questionType}
        />

        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.conditionType`}
          options={getCondition(
            currentValues.questionType,
            currentValues.operatorType,
            currentValues,
          )}
          placeholder="عملگر"
          sx={{...fieldSx, width: {xs : "100%" , md : 120}}}
          onChange={() => {
            const questionType = getValues(`conditions.${index}.subConditions.${subIndex}.questionType`);
            const combinedKey = `${questionType?.split('*')[0]}`;
            if (combinedKey === 'INFO_FIELD') {
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '---');
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
          isOperator
          disabled={!currentValues.operatorType}
        />

        <div className="flex-1 min-w-0 w-full bg-white rounded-xl border-none">{valueInput}</div>
      </div>
    </div>
  );
};
