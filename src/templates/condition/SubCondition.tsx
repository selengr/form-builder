'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { getCondition, getInput, getQuestion } from './GetConditionInput';
import { SelectController } from '@/components/condition/form/SelectController';
import { MediaConditionTip } from '@/components/condition/form/MediaConditionTip';
import {
  getDisabledConditionDefaults,
  isInfoLikeQuestion,
  isMediaUploadQuestion,
} from '@/lib/conditionQuestionTypes';

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

const disabledComboSx = {
  backgroundColor: '#EEF1F6',
  '&.Mui-disabled': {
    backgroundColor: '#EEF1F6',
    opacity: 1,
  },
  '& .MuiSelect-select.Mui-disabled': {
    WebkitTextFillColor: '#9EA3AC',
  },
  '& .MuiSelect-icon': {
    color: '#A8B0B9',
  },
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

  const isDisabledCombos = isInfoLikeQuestion(currentValues?.questionType);
  const isMediaUpload = isMediaUploadQuestion(currentValues?.questionType);

  const applyDisabledDefaults = (questionType?: string) => {
    const defaults = getDisabledConditionDefaults(questionType);
    setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, defaults.operatorType);
    setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, defaults.conditionType);
    setValue(`conditions.${index}.subConditions.${subIndex}.value`, defaults.value);
  };

  const resetDependentFields = () => {
    setValue(`conditions.${index}.subConditions.${subIndex}.operatorType`, '');
    setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '');
    setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
  };

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

      <div className="text-[14px] flex flex-col py-[6px] px-[14px] gap-3 w-full">
        <div className="flex flex-col md:flex-row gap-3 md:items-start w-full">
        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.questionType`}
          options={qacWithOutFilterOptions}
          isLoading={isFetchingQacWithOutFilter}
          placeholder="بر اساس"
          sx={{...fieldSx, width: {xs : "100%" , md : 320}}}
          onChange={(e: any) => {
            const questionType = e.target?.value;
            if (isInfoLikeQuestion(questionType)) {
              applyDisabledDefaults(questionType);
              const defaults = getDisabledConditionDefaults(questionType);
              const unicName = questionType?.split('*')[1]?.split('@')[0];
              const formattedValue = isMediaUploadQuestion(questionType) ? `{#v_${defaults.value}}` : `{"#"}`;
              console.log('[condition-payload] combo-change', {
                kind: questionType?.split('*')[0],
                operatorType: defaults.operatorType,
                conditionType: defaults.conditionType,
                value: defaults.value,
                conditionFormula: `${defaults.conditionType}(${unicName},${formattedValue})`,
                subCondition: getValues(`conditions.${index}.subConditions.${subIndex}`),
              });
            } else {
              resetDependentFields();
            }
          }}
        />

        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.operatorType`}
          options={getQuestion(currentValues.questionType, currentValues)}
          placeholder="گویه"
          forcePlaceholder={isDisabledCombos}
          sx={{...fieldSx, width: {xs : "100%" , md : 120}, ...(isDisabledCombos ? disabledComboSx : {})}}
          onChange={() => {
            const questionType = getValues(`conditions.${index}.subConditions.${subIndex}.questionType`);
            if (isInfoLikeQuestion(questionType)) {
              applyDisabledDefaults(questionType);
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.conditionType`, '');
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
          isOperator
          disabled={!currentValues.questionType || isDisabledCombos}
        />

        <SelectController
          name={`conditions.${index}.subConditions.${subIndex}.conditionType`}
          options={getCondition(
            currentValues.questionType,
            currentValues.operatorType,
            currentValues,
          )}
          placeholder="عملگر"
          forcePlaceholder={isDisabledCombos}
          sx={{...fieldSx, width: {xs : "100%" , md : 120}, ...(isDisabledCombos ? disabledComboSx : {})}}
          onChange={() => {
            const questionType = getValues(`conditions.${index}.subConditions.${subIndex}.questionType`);
            if (isInfoLikeQuestion(questionType)) {
              applyDisabledDefaults(questionType);
            } else {
              setValue(`conditions.${index}.subConditions.${subIndex}.value`, '');
            }
          }}
          isOperator
          disabled={!currentValues.operatorType || isDisabledCombos}
        />

        {isDisabledCombos ? (
          <div
            className="flex-1 min-w-0 w-full h-[52px] rounded-xl border border-[#E5E9F0] bg-[#EEF1F6]"
            aria-hidden
          />
        ) : (
          <div className="flex-1 min-w-0 w-full bg-white rounded-xl border-none">{valueInput}</div>
        )}
        </div>
        {isDisabledCombos && <MediaConditionTip variant={isMediaUpload ? 'media' : 'info'} />}
      </div>
    </div>
  );
};
