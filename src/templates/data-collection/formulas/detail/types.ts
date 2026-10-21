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
  minorName?: string;
  formulaModel: MinorFormulaModel;
}

export interface MajorFormulaDetail {
  id: number;
  majorLabel: string;
  majorName: string;
  targetPlatformEnum: string;
  frontFormula?: string | null;
  frontFormulaData?: string | null;
}
