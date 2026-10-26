import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMinorFormulaAction } from '@actions/data-collection/formulas/minor-formula/updateMinorFormulaAction';
import { UpdateMinorFormulaPayload } from '../types';

export async function updateMinorFormula(payload: UpdateMinorFormulaPayload) {
  const res = await updateMinorFormulaAction(payload);

  if (!res.success) {
    throw new Error(res.message || 'خطا در ویرایش فرمول جزئی.');
  }

  return res.data;
}

export function useUpdateMinorFormula(majorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMinorFormula,
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['minor_formula_list', majorId] });
      queryClient.invalidateQueries({ queryKey: ['minor_formula', payload.id] });
      queryClient.invalidateQueries({ queryKey: ['minor_formula', String(payload.id)] });
    },
  });
}
