'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const UPDATE_MAJOR_INFO_URL = '/admin/data-collection/formulas/major-formula-update-info';

const updateMajorFormulaInfoSchema = z.object({
  id: z.number().int().positive(),
  majorName: z.string().trim().min(2).max(50),
});

export type UpdateMajorFormulaInfoInput = z.infer<typeof updateMajorFormulaInfoSchema>;

export async function updateMajorFormulaInfoAction(input: UpdateMajorFormulaInfoInput) {
  const parsed = updateMajorFormulaInfoSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  const result = await api.put(UPDATE_MAJOR_INFO_URL, parsed.data);

  console.log('[updateMajorFormulaInfoAction] response:', JSON.stringify(result, null, 2));

  return result;
}
