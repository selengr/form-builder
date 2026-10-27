'use server';

import { getMinorFormulaAction } from './getMinorFormulaAction';
import { getFormulaFormsAction } from './getFormulaFormsAction';
import { getFormQuestionsAction } from './getFormQuestionsAction';
import { getOnlyAllQuestionsAction } from './getOnlyAllQuestionsAction';
import { getOnlyAllCalcAction } from './getOnlyAllCalcAction';
import { getCalculatorFieldsAction } from './getCalculatorFieldsAction';

export async function getMinorFormulaEditDataAction(minorId: number | string) {
  const minorFormula = await getMinorFormulaAction(minorId);

  if (!minorFormula.success) {
    return minorFormula;
  }

  const formId = minorFormula.data?.formulaModel?.formId ? String(minorFormula.data.formulaModel.formId) : '';

  const [forms, formQuestions, onlyAllQuestions, onlyAllCalc, calculatorFields] = await Promise.all([
    getFormulaFormsAction(),
    formId ? getFormQuestionsAction(formId) : null,
    formId ? getOnlyAllQuestionsAction(formId) : null,
    formId ? getOnlyAllCalcAction(formId) : null,
    formId ? getCalculatorFieldsAction(formId) : null,
  ]);

  return {
    success: true as const,
    data: { minorFormula: minorFormula.data, formId, forms, formQuestions, onlyAllQuestions, onlyAllCalc, calculatorFields },
  };
}
