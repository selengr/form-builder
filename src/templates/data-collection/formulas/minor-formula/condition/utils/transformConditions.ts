import { formatContainText } from './formatContainText';
import { TConditionData, TConditionFormData, TSubConditionData } from '../schema';
import { IPostCondition } from '../types';

export const formatValue = (subCondition: TSubConditionData): string => {
  const conditionType = subCondition.conditionType?.split('@')[0];
  const questionType = subCondition.questionType?.split('@')[0];
  const operatorType = subCondition.operatorType?.split('@')[0];
  const value =
    typeof subCondition.value !== 'object' ? subCondition.value?.split('@')[0] : subCondition.value;

  if (operatorType === 'OPTION') {
    if (typeof subCondition.value === 'object') {
      return `{${Array.isArray(value) && value?.map((item: string) => item?.split('@')[0])}}`;
    }
    return `{${value}}`;
  }

  if (operatorType === 'VALUE') {
    return `{#v_${value}}`;
  }

  if (operatorType === 'TEXT') {
    if (conditionType === '#startWithText' || conditionType === '#endWithText') {
      return questionType.split('*')[0] === 'INFO_FIELD' ? `{"#"}` : `{"${value}"}`;
    }
    if (conditionType === '!#containAnyText' || conditionType === '#containAnyText') {
      return `{${formatContainText(value as string)}}`;
    }
    if (
      conditionType === '#lenEqualText' ||
      conditionType === '#lenGraterThanText' ||
      conditionType === '#lenLessThanText'
    ) {
      return `{#v_${value}}`;
    }
    return value as string;
  }

  if (operatorType === 'DATE') {
    return `{#v_"${value}"}`;
  }

  return value as string;
};

export const transformConditions = (
  input: TConditionFormData,
  formId: string,
): IPostCondition[] =>
  input.conditions.map((condition: TConditionData, index) => {
    const { subConditions } = condition;

    const conditionFormula = subConditions
      .map((subCondition: TSubConditionData) => {
        const conditionType = subCondition.conditionType?.split('@')[0];
        const questionType = subCondition.questionType?.split('@')[0];
        const logicalOperator = subCondition.logicalOperator?.split('@')[0];
        const baseCondition = `${conditionType}(${questionType.split('*')[1]},${formatValue(subCondition)})`;

        return logicalOperator ? ` ${logicalOperator} ${baseCondition}` : baseCondition;
      })
      .join('');

    return {
      formBuilderId: Number(formId),
      conditionFormula,
      frontConditionData: JSON.stringify(input.conditions[index]),
    };
  });
