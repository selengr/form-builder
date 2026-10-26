'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';
import type { UpdateMinorFormulaPayload } from '@/templates/data-collection/formulas/minor-formula/types';

const UPDATE_MINOR_URL = '/admin/data-collection/formulas/minor-formula';

const conditionValueSchema = z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]);

const updateMinorFormulaSchema = z.object({
  id: z.number().int().positive(),
  majorId: z.number().int().positive(),
  minorName: z.string().trim().min(1),
  formulaModel: z.object({
    formId: z.number().int().positive(),
    formula: z.string(),
    frontFormulaData: z.string(),
    condition: z.object({
      type: z.literal('group'),
      children: z
        .array(
          z.object({
            type: z.literal('condition'),
            field: z.string().min(1),
            operator: z.string().min(1),
            value: conditionValueSchema,
            nextOperator: z.enum(['AND', 'OR']),
          }),
        )
        .min(1),
    }),
  }),
});

export async function updateMinorFormulaAction(payload: UpdateMinorFormulaPayload) {
  const parsed = updateMinorFormulaSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  const result = await api.put(UPDATE_MINOR_URL, parsed.data);

  console.log('[updateMinorFormulaAction] response:', JSON.stringify(result, null, 2));

  return result;
}
