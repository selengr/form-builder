'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const CREATE_MAJOR_URL = '/admin/data-collection/formulas/major-formula';

const createMajorFormulaSchema = z.object({
  majorName: z.string().min(2).max(50),
  targetPlatformEnum: z.string().min(1),
  majorLabel: z.string().min(8).max(30),
});

export type CreateMajorFormulaInput = z.infer<typeof createMajorFormulaSchema>;

export async function createMajorFormulaAction(input: CreateMajorFormulaInput) {
  const parsed = createMajorFormulaSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  const result = await api.post(CREATE_MAJOR_URL, parsed.data);

  console.log('[createMajorFormulaAction] response:', JSON.stringify(result, null, 2));

  return result;
}
