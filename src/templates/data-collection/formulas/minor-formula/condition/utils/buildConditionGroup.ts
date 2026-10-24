import { TConditionFormData, TSubConditionData } from '../schema';
import { getQuestionField, REF_ID_CONDITION_TYPE } from './questionType';
import {
  FormulaConditionGroup,
  FormulaConditionItem,
  FormulaConditionNextOperator,
  FormulaConditionOperator,
  FormulaConditionValue,
} from '../../types';

const OPERATOR_MAP: Record<string, FormulaConditionOperator> = {
  '#equalMultiChoiceSingle': 'EQUAL',
  '#equalThanMultiChoiceMulti': 'EQUAL',
  '#equalThanSpectralSingle': 'EQUAL',
  '#equalThanNumber': 'EQUAL',
  '!#equalMultiChoiceSingle': 'NOT_EQUAL',
  '!#equalThanMultiChoiceMulti': 'NOT_EQUAL',
  '!#equalThanNumber': 'NOT_EQUAL',
  '#greaterThanMultiChoiceSingle': 'GREATER_THAN',
  '#greaterThanSpectralSingle': 'GREATER_THAN',
  '#greaterThanSpectralDouble': 'GREATER_THAN',
  '#greaterThanNumber': 'GREATER_THAN',
  '#lessThanMultiChoiceSingle': 'LESS_THAN',
  '#lessThanSpectralSingle': 'LESS_THAN',
  '#lessThanSpectralDouble': 'LESS_THAN',
  '#greaterThanSpectral': 'LESS_THAN',
  '#lessThanNumber': 'LESS_THAN',
  '#greaterEqualThanSpectralSingle': 'GREATER_EQUAL_THAN',
  '#greaterEqualThanNumber': 'GREATER_EQUAL_THAN',
  '#lessEqualThanSpectralSingle': 'LESS_EQUAL_THAN',
  '#lessEqualThanNumber': 'LESS_EQUAL_THAN',
  '#containMultiChoiceMulti': 'CONTAINS',
  '#containAnyText': 'CONTAINS',
  '!#containMultiChoiceMulti': 'NOT_CONTAINS',
  '!#containAnyText': 'NOT_CONTAINS',
  '#startWithText': 'STARTS_WITH',
  '#endWithText': 'ENDS_WITH',
  '#lenEqualText': 'LENGTH_EQUAL',
  '#lenGreaterThanText': 'LENGTH_GREATER_THAN',
  '#lenLessThanText': 'LENGTH_LESS_THAN',
  '#beforeDate': 'BEFORE_DATE',
  '#afterDate': 'AFTER_DATE',
  [REF_ID_CONDITION_TYPE]: 'EQUAL',
};

const NUMERIC_OPERATOR_TYPES = ['VALUE', 'OPTION'];
const LABELED_OPERATOR_TYPES = ['OPTION', 'QUESTION', 'CALCULATION'];

const stripLabel = (value: string) => String(value).split('@')[0];

const stripTrailingLabel = (value: string) => {
  const labelIndex = value.lastIndexOf('@');
  return labelIndex === -1 ? value : value.slice(0, labelIndex);
};

export const toNextOperator = (logicalOperator?: string): FormulaConditionNextOperator =>
  stripLabel(logicalOperator ?? '') === '||' ? 'OR' : 'AND';

export const getConditionField = (questionType: string) => getQuestionField(questionType);

export const getConditionOperator = (conditionType: string): FormulaConditionOperator | undefined =>
  OPERATOR_MAP[stripLabel(conditionType)];

export const toConditionValue = (subCondition: TSubConditionData): FormulaConditionValue => {
  const operatorType = stripLabel(subCondition.operatorType);
  const shouldBeNumber = NUMERIC_OPERATOR_TYPES.includes(operatorType);
  const hasLabel = LABELED_OPERATOR_TYPES.includes(operatorType);

  const convert = (raw: string) => {
    const text = String(raw);
    const value = (hasLabel ? stripTrailingLabel(text) : text).trim();
    return shouldBeNumber && value !== '' && Number.isFinite(Number(value)) ? Number(value) : value;
  };

  return Array.isArray(subCondition.value) ? subCondition.value.map(convert) : convert(subCondition.value);
};

export const buildConditionGroup = (input: TConditionFormData): FormulaConditionGroup => {
  const subConditions = input.conditions.flatMap((condition) => condition.subConditions);

  const children: FormulaConditionItem[] = subConditions.map((subCondition, index) => {
    const operator = getConditionOperator(subCondition.conditionType);

    if (!operator) {
      throw new Error(`عملگر «${subCondition.conditionType}» پشتیبانی نمی‌شود`);
    }

    return {
      type: 'condition',
      field: getConditionField(subCondition.questionType),
      operator,
      value: toConditionValue(subCondition),
      nextOperator: toNextOperator(subConditions[index + 1]?.logicalOperator),
    };
  });

  return { type: 'group', children };
};
