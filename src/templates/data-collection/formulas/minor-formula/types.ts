export type FormulaConditionOperator =
  | 'EQUAL'
  | 'NOT_EQUAL'
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'GREATER_EQUAL_THAN'
  | 'LESS_EQUAL_THAN'
  | 'CONTAINS'
  | 'NOT_CONTAINS'
  | 'STARTS_WITH'
  | 'ENDS_WITH'
  | 'LENGTH_EQUAL'
  | 'LENGTH_GREATER_THAN'
  | 'LENGTH_LESS_THAN'
  | 'BEFORE'
  | 'AFTER';

export type FormulaConditionNextOperator = 'AND' | 'OR';

export type FormulaConditionValue = string | number | Array<string | number>;

export interface FormulaConditionItem {
  type: 'condition';
  field: string;
  operator: FormulaConditionOperator;
  value: FormulaConditionValue;
  nextOperator: FormulaConditionNextOperator;
}

export interface FormulaConditionGroup {
  type: 'group';
  children: FormulaConditionItem[];
}

export interface FormulaModel {
  formId: number;
  formula: string;
  condition: FormulaConditionGroup;
}

export interface CreateMinorFormulaPayload {
  majorId: number;
  minorName: string;
  formulaModel: FormulaModel;
}
