import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMinorFormulaAction } from '@actions/data-collection/formulas/minor-formula/createMinorFormulaAction';
import { CreateMinorFormulaPayload } from '../types';

export async function createMinorFormula(payload: CreateMinorFormulaPayload) {
  const res = await createMinorFormulaAction(payload);

  if (!res.success) {
    const serverMessage = 'serverMessage' in res ? res.serverMessage : undefined;
    throw new Error(serverMessage || res.message || 'خطا در ثبت فرمول جزئی.');
  }

  return res.data;
}

export function useCreateMinorFormula(majorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMinorFormula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minor_formula_list', majorId] });
    },
  });
}
