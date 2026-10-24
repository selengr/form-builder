import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMinorFormulaAction } from '@actions/data-collection/formulas/minor-formula/deleteMinorFormulaAction';

export async function deleteMinorFormula(minorId: number) {
  const res = await deleteMinorFormulaAction(minorId);

  if (!res.success) {
    throw new Error(res.message || 'خطا در حذف فرمول جزئی.');
  }

  return res.data;
}

export function useDeleteMinorFormula(majorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMinorFormula,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minor_formula_list', majorId] });
    },
  });
}
