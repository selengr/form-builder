import { useMutation } from '@tanstack/react-query';
import { runMajorFormulaAction, RunMajorFormulaInput } from '@actions/data-collection/formulas/runMajorFormulaAction';

export async function runMajorFormula(input: RunMajorFormulaInput) {
  const res = await runMajorFormulaAction(input);

  if (!res.success) {
    throw new Error(res.message || 'خطا در اجرای فرمول.');
  }

  return res.data?.result;
}

export function useRunMajorFormula() {
  return useMutation({ mutationFn: runMajorFormula });
}
