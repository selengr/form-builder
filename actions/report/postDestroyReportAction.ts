'use server';

import { api } from '@/services/axios/actionWapper';
import { destroyReportSchema } from '@/validators/destroyReportSchema';
import type { z } from 'zod';

export type DestroyReportInput = z.infer<typeof destroyReportSchema>;

export async function postDestroyReportAction(input: DestroyReportInput) {
  const parsed = destroyReportSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/user/report-destroy-form', parsed.data);
}
