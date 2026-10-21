'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const UPDATE_MAJOR_URL = '/admin/data-collection/formulas/major-formula';

const updateMajorFormulaSchema = z.object({
  id: z.number().int().positive(),
  frontFormula: z.string().trim().min(1),
  frontFormulaData: z.string().min(1),
});

export type UpdateMajorFormulaInput = z.infer<typeof updateMajorFormulaSchema>;

export async function updateMajorFormulaAction(input: UpdateMajorFormulaInput) {
  const parsed = updateMajorFormulaSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  const result = await api.put(UPDATE_MAJOR_URL, parsed.data);

  console.log('[updateMajorFormulaAction] response:', JSON.stringify(result, null, 2));

  return result;
}
