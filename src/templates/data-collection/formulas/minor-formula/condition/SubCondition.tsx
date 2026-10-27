'use client';

import { Fragment } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { getCondition, getInput, getQuestion } from './GetConditionInput';
import { SelectController } from './form/SelectController';
import {
  isRefIdQuestion,
  REF_ID_CONDITION_TYPE,
  REF_ID_OPERATOR_TYPE,
} from './utils/questionType';

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
  questionsEmptyText?: string;
  onSelectFormRequest?: () => void;
};

const fieldSx = {
  width: '100%',
  maxHeight: '52px !important',
  flex: 1,
  backgroundColor: 'white',
};

const refIdSelectedSx = {
  backgroundColor: '#F1F6FD',
  '&&.MuiInputBase-root': { borderColor: '#C9DAF5' },
  '& .MuiSelect-select': { color: '#1758BA', fontWeight: 500 },
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
  questionsEmptyText,
  onSelectFormRequest,
}) => {
  const { control, setValue, getValues, clearErrors } = useFormContext();
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
      control,
      setValue,
    },
  );

  return (
    <div className="flex flex-col gap-3">
      {subIndex === 0 && (
        <p
          className="text-[14px] bg-white border-b border-b-[#DDE1E6] font-medium text-right"
          style={{ padding: '10px 14px', color: '#9A9A9A' }}>
          اگر
        </p>
      )}

      <div className="text-[14px] flex flex-col py-[6px] px-[14px] md:flex-row gap-3 md:items-start w-full">
        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.questionType`}
          options={qacWithOutFilterOptions}
          isLoading={isFetchingQacWithOutFilter}
          emptyText={questionsEmptyText}
          emptyActionText="انتخاب فرم"
          onEmptyAction={onSelectFormRequest}
          placeholder="بر اساس"
          sx={{
            ...fieldSx,
            width: { xs: '100%', md: 305 },
            ...(isRefIdQuestion(currentValues.questionType) && refIdSelectedSx),
          }}
          onChange={(e: any) => {
            const selectedQuestionType = e.target?.value;
            const combinedKey = `${selectedQuestionType?.split('*')[0]}`;
            if (isRefIdQuestion(selectedQuestionType)) {
              const refIdOption = qacWithOutFilterOptions?.find((option) => option.value === selectedQuestionType);
              setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, REF_ID_OPERATOR_TYPE);
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, REF_ID_CONDITION_TYPE);
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, refIdOption?.elementStr ?? '');
              clearErrors([
                `conditions.${index}.subConditions.${subIndex}.operatorType`,
                `conditions.${index}.subConditions.${subIndex}.conditionType`,
                `conditions.${index}.subConditions.${subIndex}.value`,
              ]);
            } else if (combinedKey === 'INFO_FIELD') {
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

        {isRefIdQuestion(currentValues.questionType) ? (
          <div
            className="md:flex-1 shrink-0 min-w-0 w-full flex items-center rounded-xl text-[14px] font-semibold"
            style={{
              height: 52,
              padding: '0 16px',
              color: '#379E76',
              backgroundColor: '#ECFDF5',
              border: '1px solid #BBEBD5',
            }}>
            مطابقت داشت
          </div>
        ) : (
          <>
            <SelectController
              name={`conditions.${index}.subConditions.${subIndex}.operatorType`}
              options={getQuestion(currentValues.questionType, currentValues)}
              placeholder="گویه"
              sx={{ ...fieldSx, width: { xs: '100%', md: 122 } }}
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
              sx={{ ...fieldSx, width: { xs: '100%', md: 122 } }}
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
          </>
        )}
      </div>
    </div>
  );
};
