import { zodResolver } from '@hookform/resolvers/zod';
import { idGenerator } from '@/lib/idGenerator';
import { IGetCondition } from '@/types/condition';
import { useFieldArray, useForm } from 'react-hook-form';
import { ConditionFormSchema, TConditionData, type TConditionFormData, TSubConditionData } from '@/lib/ConditionFormSchema';
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

const TransformOutputToInput = (conditionJson: IGetCondition): TConditionData => {
  const { frontConditionData } = conditionJson;
  const { qacWithOutFilterOptions } = useGetQacWithOutFilterList();

  const conditions = JSON.parse(frontConditionData);
  const { subConditions, returnQuestionId, elseQuestionId } = conditions;

  function findOptionLabel(item: any, key: string) {
    const option = item.options?.[key];
    const caption = option ? option[1] : undefined;
    return `${key}@${caption}`;
  }

  const SubConditionsData: TSubConditionData[] = subConditions?.map((subCondition: TSubConditionData) => {
    const id = subCondition.id;
    const conditionType = subCondition.conditionType;
    const questionType = subCondition.questionType;
    const operatorType = subCondition.operatorType;
    const logicalOperator = subCondition.logicalOperator;
    let value: string | string[] = '';

    const splitedOperatorType = subCondition.operatorType?.split('@')[0];
    const splitedQuestionType = questionType?.split('*')[0]

    if (splitedOperatorType === 'OPTION' && splitedQuestionType === 'MULTIPLE_CHOICE_MULTI_SELECT' || splitedQuestionType === "MULTIPLE_CHOICE") {
      // const op: string[] = [];
      // if (Array.isArray(subCondition.value)) {
      //   subCondition.value?.map((item: string) => op.push(item?.toString()));
      //   value = op;
      // }
      const questionId = subCondition.questionType?.split('*')[1];
      const compared = questionId?.split('@')[0];
      const found = qacWithOutFilterOptions?.find(
        (val: any) => val?.value.includes(compared)
      );

      if (found) {
        if (Array.isArray(subCondition.value)) {
          const optionList: string[] = []
          subCondition.value
            .map((val: string, index) => optionList[index] = findOptionLabel(found, val.split('@')[0]))
            .join(", ");
          value = optionList
        } else {
          value = findOptionLabel(found, (subCondition.value as string).split('@')[0]);
        }
      }

    } else value = subCondition.value.toString();
    return {
      id: subCondition.id,
      conditionType,
      questionType,
      operatorType,
      value,
      logicalOperator,
    };
  });

  return {
    id: conditionJson.id,
    returnQuestionId: returnQuestionId,
    elseQuestionId: elseQuestionId,
    subConditions: SubConditionsData,
  };
};

export const useConditionalForm = (condition: IGetCondition | undefined) => {
  const methods = useForm<TConditionFormData>({
    resolver: zodResolver(ConditionFormSchema),
    defaultValues: {
      conditions: [condition ? TransformOutputToInput(condition) : createNewCondition()],
    },
  });

  const {
    control,
    handleSubmit,
    // formState: { errors },
    getValues,
  } = methods;

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
