import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateMajorFormulaInfoAction,
  UpdateMajorFormulaInfoInput,
} from '@actions/data-collection/formulas/updateMajorFormulaInfoAction';

export async function updateMajorFormulaInfo(input: UpdateMajorFormulaInfoInput) {
  const res = await updateMajorFormulaInfoAction(input);

  if (!res.success) {
    throw new Error(res.message || 'خطا در ثبت تنظیمات فرمول.');
  }

  return res.data;
}

export function useUpdateMajorFormulaInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMajorFormulaInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['major_formula_list'] });
      queryClient.invalidateQueries({ queryKey: ['major_formula'] });
    },
  });
}
