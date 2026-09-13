import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { idGenerator } from '@/lib/idGenerator';
import { IGetCondition } from '@/types/condition';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  ConditionFormSchema,
  TConditionData,
  type TConditionFormData,
  TSubConditionData,
} from '@/lib/ConditionFormSchema';
import { useGetQacWithOutFilterList } from '@/app/reports/create-solo/[id]/_hooks/useGetQacWithOutFilterList';

export const createNewSubCondition = () => ({
  logicalOperator: '',
  questionType: '',
  operatorType: '',
  conditionType: '',
  value: '',
  id: idGenerator(),
});

export const createNewCondition = () => ({
  subConditions: [createNewSubCondition()],
  elseQuestionId: '',
  returnQuestionId: '',
});

const TransformOutputToInput = (
  conditionJson: IGetCondition,
  qacWithOutFilterOptions?: ReturnType<typeof useGetQacWithOutFilterList>['qacWithOutFilterOptions'],
): TConditionData => {
  const { frontConditionData } = conditionJson;

  let conditions: any;
  try {
    conditions = JSON.parse(frontConditionData);
  } catch {
    return {
      id: conditionJson.id,
      returnQuestionId: '',
      elseQuestionId: '',
      subConditions: [createNewSubCondition()],
    };
  }

  const { subConditions, returnQuestionId, elseQuestionId } = conditions ?? {};

  function findOptionLabel(item: any, key: string) {
    const option = item.options?.[key];
    const caption = option ? option[1] : undefined;
    return `${key}@${caption}`;
  }

  const SubConditionsData: TSubConditionData[] = (Array.isArray(subConditions) ? subConditions : []).map(
    (subCondition: TSubConditionData) => {
      const conditionType = subCondition.conditionType;
      const questionType = subCondition.questionType;
      const operatorType = subCondition.operatorType;
      const logicalOperator = subCondition.logicalOperator;
      let value: string | string[] = '';

      const splitedOperatorType = subCondition.operatorType?.split('@')[0];
      const splitedQuestionType = questionType?.split('*')[0];

      if (
        splitedOperatorType === 'OPTION' && splitedQuestionType === 'MULTIPLE_CHOICE_MULTI_SELECT' ||
        splitedQuestionType === 'MULTIPLE_CHOICE'
      ) {
        const questionId = subCondition.questionType?.split('*')[1];
        const compared = questionId?.split('@')[0];
        const found = qacWithOutFilterOptions?.find((val: any) => val?.value.includes(compared));

        if (found) {
          if (Array.isArray(subCondition.value)) {
            const optionList: string[] = [];
            subCondition.value.map(
              (val: string, index) =>
                (optionList[index] = findOptionLabel(found, String(val).split('@')[0])),
            );
            value = optionList;
          } else if (subCondition.value != null) {
            value = findOptionLabel(found, String(subCondition.value).split('@')[0]);
          }
        } else if (subCondition.value != null) {
          value = Array.isArray(subCondition.value)
            ? subCondition.value.map(String)
            : String(subCondition.value);
        }
      } else {
        value = subCondition.value == null ? '' : String(subCondition.value);
      }

      return {
        id: subCondition.id ?? idGenerator(),
        conditionType,
        questionType,
        operatorType,
        value,
        logicalOperator,
      };
    },
  );

  return {
    id: conditionJson.id,
    returnQuestionId: returnQuestionId ?? '',
    elseQuestionId: elseQuestionId ?? '',
    subConditions: SubConditionsData.length ? SubConditionsData : [createNewSubCondition()],
  };
};

export const useConditionalForm = (condition: IGetCondition | undefined) => {
  const { qacWithOutFilterOptions } = useGetQacWithOutFilterList();

  const methods = useForm<TConditionFormData>({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      conditions: [condition ? TransformOutputToInput(condition, qacWithOutFilterOptions) : createNewCondition()],
    },
  });

  const { control, getValues, reset } = methods;

  // When QAC options arrive after mount, re-apply edit values (option labels).
  // Depend on length (not the array ref) — options is remapped every render.
  useEffect(() => {
    if (!condition || !qacWithOutFilterOptions?.length) return;
    reset({
      conditions: [TransformOutputToInput(condition, qacWithOutFilterOptions)],
    });
  }, [condition, qacWithOutFilterOptions?.length, reset]);

  const {
    fields: conditions,
    append: appendCondition,
    remove: removeCondition,
    update: updateCondition,
  } = useFieldArray({
    control,
    name: 'conditions',
  });

  const handleAddCondition = () => {
    appendCondition(createNewCondition());
  };

  const handleRemoveCondition = (index: number) => {
    removeCondition(index);
  };

  const handleAddSubCondition = (index: number, subIndex: number) => {
    const currentCondition = getValues().conditions[index];
    const clonedCondition = structuredClone(currentCondition);

    const newSubConditions = [
      ...clonedCondition.subConditions.slice(0, subIndex + 1),
      {
        logicalOperator: clonedCondition.subConditions.length > 0 ? '&&' : '',
        questionType: '',
        operatorType: '',
        conditionType: '',
        value: '',
        id: idGenerator(),
      },
      ...clonedCondition.subConditions.slice(subIndex + 1),
    ];

    updateCondition(index, {
      ...clonedCondition,
      subConditions: newSubConditions,
    });
  };

  const handleRemoveSubCondition = (conditionIndex: number, subConditionIndex: number) => {
    const updatedCondition = { ...conditions[conditionIndex] };
    updatedCondition.subConditions.splice(subConditionIndex, 1);
    updateCondition(conditionIndex, updatedCondition);
  };

  return {
    methods,
    conditions,
    handleAddCondition,
    handleRemoveCondition,
    handleAddSubCondition,
    handleRemoveSubCondition,
  };
};
