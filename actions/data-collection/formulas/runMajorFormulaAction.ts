'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const RUN_FORMULA_URL = '/admin/data-collection/formulas/saya-data-collection-run-formula';

const runMajorFormulaSchema = z.object({
  accessKey: z.string().trim().min(1),
  label: z.string().trim().min(1),
  metaParameters: z
    .array(z.tuple([z.string().trim().min(1), z.union([z.number(), z.string().min(1)])]))
    .min(1)
    .max(5),
});

export type RunMajorFormulaInput = z.infer<typeof runMajorFormulaSchema>;

export async function runMajorFormulaAction(input: RunMajorFormulaInput) {
  const parsed = runMajorFormulaSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  const { accessKey, label, metaParameters } = parsed.data;
  const metaParametersJson = metaParameters
    .map(([key, value]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`)
    .join(',');
  const body = `{"accessKey":${JSON.stringify(accessKey)},"label":${JSON.stringify(label)},"metaParameters":{${metaParametersJson}}}`;

  const result = await api.post<{ result?: unknown }>(RUN_FORMULA_URL, body);

  return result;
}
