'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';
import type { CreateMinorFormulaPayload } from '@/templates/data-collection/formulas/minor-formula/types';

const CREATE_MINOR_URL = '/admin/data-collection/formulas/minor-formula';

const SERVER_OPERATORS = [
  'EQUAL',
  'GREATER_THAN',
  'LESS_THAN',
  'GREATER_EQUAL_THAN',
  'LESS_EQUAL_THAN',
  'CONTAINS',
  'NOT_CONTAINS',
  'START_WITH',
  'END_WITH',
  'BEFORE_DATE',
  'AFTER_DATE',
] as const;

const SERVER_OPERATOR_ALIASES: Record<string, (typeof SERVER_OPERATORS)[number]> = {
  STARTS_WITH: 'START_WITH',
  ENDS_WITH: 'END_WITH',
};

const operatorSchema = z
  .string()
  .transform((operator) => SERVER_OPERATOR_ALIASES[operator] ?? operator)
  .pipe(z.enum(SERVER_OPERATORS));

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

export async function createMinorFormulaAction(payload: CreateMinorFormulaPayload) {
  const parsed = createMinorFormulaSchema.safeParse(payload);

  if (!parsed.success) {
    const operatorIssue = parsed.error.issues.find((issue) => issue.path.at(-1) === 'operator');

    if (operatorIssue) {
      const childIndex = Number(operatorIssue.path.at(-2));
      const operator = payload.formulaModel.condition.children[childIndex]?.operator;
      return { success: false as const, message: `عملگر «${operator}» توسط سرور پشتیبانی نمی‌شود` };
    }

    return { success: false as const, message: 'Validation error.' };
  }

  const result = await api.post(CREATE_MINOR_URL, parsed.data);

  console.log('[createMinorFormulaAction] response:', JSON.stringify(result, null, 2));

  return result;
}
