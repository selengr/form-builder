import { idGenerator } from '../../utils/idGenerator';
import { getCondition, getQuestion } from '../GetConditionInput';
import { TConditionData, TSubConditionData } from '../schema';
import { createNewCondition } from '../hooks/useConditionalForm';
import { FormulaConditionGroup, FormulaConditionItem } from '../../types';
import { getConditionOperator } from './buildConditionGroup';
import { getQuestionField, isRefIdQuestion, REF_ID_CONDITION_TYPE, REF_ID_OPERATOR_TYPE } from './questionType';

type Option = { value: string; label: string; elementStr?: string };

export interface ConditionFormSources {
  questionOptions: Option[];
  onlyAllQuestions: any[];
  questionValueOptions: Option[];
  calculationValueOptions: Option[];
}

const OPERATOR_TYPE_PRIORITY = ['OPTION', 'QUESTION', 'CALCULATION', 'VALUE', 'TEXT', 'DATE'];

const withLabel = (option: Option) => `${option.value}@${option.label}`;

const isNumeric = (value: unknown) =>
  typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)));

const getQuestionOptions = (field: string, onlyAllQuestions: any[]) => {
  const question = onlyAllQuestions?.find((item) => item?.extMap?.UNIC_NAME === field);
  return (question?.extMap?.OPTIONS ?? {}) as Record<string, [number, string]>;
};

const stripTrailingLabel = (value: string) => {
  const labelIndex = value.lastIndexOf('@');
  return labelIndex === -1 ? value : value.slice(0, labelIndex);
};

const findByKey = (options: Option[], key: string) => options.find((option) => stripTrailingLabel(option.value) === key);

const toOptionValue = (key: string, options: Record<string, [number, string]>) => {
  const caption = options[key]?.[1];
  return caption === undefined ? undefined : `${key}@${caption}`;
};

const matchValue = (operatorType: string, item: FormulaConditionItem, sources: ConditionFormSources) => {
  const { value, field } = item;

  switch (operatorType) {
    case 'OPTION': {
      const options = getQuestionOptions(field, sources.onlyAllQuestions);
      const keys = (Array.isArray(value) ? value : [value]).map(String);
      const mapped = keys.map((key) => toOptionValue(key, options));
      if (mapped.some((option) => option === undefined)) return undefined;
      return Array.isArray(value) ? (mapped as string[]) : mapped[0];
    }
    case 'QUESTION':
      return Array.isArray(value) ? undefined : findByKey(sources.questionValueOptions, String(value))?.value;
    case 'CALCULATION':
      return Array.isArray(value) ? undefined : findByKey(sources.calculationValueOptions, String(value))?.value;
    case 'VALUE':
      return !Array.isArray(value) && isNumeric(value) ? String(value) : undefined;
    case 'TEXT':
    case 'DATE':
      return Array.isArray(value) ? undefined : String(value);
    default:
      return undefined;
  }
};

const toSubCondition = (
  item: FormulaConditionItem,
  logicalOperator: string,
  sources: ConditionFormSources,
): TSubConditionData => {
  const base = { id: idGenerator(), logicalOperator };
  const questionType =
    sources.questionOptions.find((option) => getQuestionField(option.value) === item.field)?.value ?? item.field;

  if (isRefIdQuestion(questionType)) {
    const refIdOption = sources.questionOptions.find((option) => isRefIdQuestion(option.value));
    return {
      ...base,
      questionType: refIdOption?.value ?? questionType,
      operatorType: REF_ID_OPERATOR_TYPE,
      conditionType: REF_ID_CONDITION_TYPE,
      value: refIdOption?.elementStr ?? String(item.value ?? ''),
    };
  }

  const operatorTypes = [...getQuestion(questionType, null)].sort(
    (a, b) => OPERATOR_TYPE_PRIORITY.indexOf(a.value) - OPERATOR_TYPE_PRIORITY.indexOf(b.value),
  );

  let fallback: TSubConditionData | undefined;

  for (const operatorType of operatorTypes) {
    const conditionType = getCondition(questionType, operatorType.value, null).find(
      (option) => getConditionOperator(option.value) === item.operator,
    );
    if (!conditionType) continue;

    const value = matchValue(operatorType.value, item, sources);
    const subCondition = {
      ...base,
      questionType,
      operatorType: withLabel(operatorType),
      conditionType: withLabel(conditionType),
      value: value ?? '',
    };

    if (value !== undefined) return subCondition;
    fallback ??= subCondition;
  }

  return fallback ?? { ...base, questionType, operatorType: '', conditionType: '', value: '' };
};

export const conditionGroupToForm = (
  group: FormulaConditionGroup | undefined | null,
  sources: ConditionFormSources,
): TConditionData => {
  const children = group?.children ?? [];
  if (!children.length) return createNewCondition();

  return {
    subConditions: children.map((item, index) =>
      toSubCondition(item, index === 0 ? '' : children[index - 1].nextOperator === 'OR' ? '||' : '&&', sources),
    ),
  };
};
