'use server';

import { z } from 'zod';
import { serverApi } from '@/services/axios/serverApi';
import type { CreateMinorFormulaPayload } from '@/templates/data-collection/formulas/minor-formula/types';

const CREATE_MINOR_URL = '/admin/data-collection/formulas/minor-formula';

const SERVER_OPERATOR_ALIASES: Record<string, string> = {
  STARTS_WITH: 'START_WITH',
  ENDS_WITH: 'END_WITH',
};

const operatorSchema = z
  .string()
  .min(1)
  .transform((operator) => SERVER_OPERATOR_ALIASES[operator] ?? operator);

const conditionValueSchema = z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]);

const createMinorFormulaSchema = z.object({
  majorId: z.number().int().positive(),
  minorName: z.string().trim().min(1),
  formulaModel: z.object({
    formId: z.number().int().positive(),
    formula: z.string(),
    condition: z.object({
      type: z.literal('group'),
      children: z
        .array(
          z.object({
            type: z.literal('condition'),
            field: z.string().min(1),
            operator: operatorSchema,
            value: conditionValueSchema,
            nextOperator: z.enum(['AND', 'OR']),
          }),
        )
        .min(1),
    }),
  }),
});

const getServerMessage = (data: unknown): string | undefined => {
  const message = (data as { message?: unknown } | undefined)?.message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) return message[0]?.title;
  return undefined;
};

export async function createMinorFormulaAction(payload: CreateMinorFormulaPayload) {
  const parsed = createMinorFormulaSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false as const, message: 'Validation error.' };
  }

  try {
    const response = await serverApi.post(CREATE_MINOR_URL, parsed.data, { validateStatus: () => true });

    console.log('[createMinorFormulaAction] response:', response.status, JSON.stringify(response.data, null, 2));

    if (response.status >= 200 && response.status < 300) {
      return { success: true as const, data: response.data };
    }

    return {
      success: false as const,
      message: getServerMessage(response.data) || 'خطا در ثبت فرمول جزئی.',
      status: response.status,
    };
  } catch {
    return { success: false as const, message: 'خطا در ارتباط با سرور' };
  }
}
