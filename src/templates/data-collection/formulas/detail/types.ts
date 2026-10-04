export interface MinorFormulaCondition {
  type: string;
  field: string;
  operator: string;
  value: string;
}

export interface MinorFormulaModel {
  formId: number;
  formula: string;
  condition: MinorFormulaCondition;
}

export interface MinorFormulaListItem {
  id: number;
  majorId: number;
  formulaModel: MinorFormulaModel;
}
