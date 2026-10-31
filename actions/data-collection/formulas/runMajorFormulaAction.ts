'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const RUN_FORMULA_URL = '/admin/data-collection/formulas/saya-data-collection-run-formula';

const runMajorFormulaSchema = z.object({
  accessKey: z.string().trim().min(1),
  label: z.string().trim().min(1),
  metaParameters: z.record(z.string().min(1), z.number()),
});

export type RunMajorFormulaInput = z.infer<typeof runMajorFormulaSchema>;

export async function runMajorFormulaAction(input: RunMajorFormulaInput) {
  const parsed = runMajorFormulaSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  const result = await api.post<{ result?: unknown }>(RUN_FORMULA_URL, parsed.data);

  console.log('[runMajorFormulaAction] response:', JSON.stringify(result, null, 2));

  return result;
}
