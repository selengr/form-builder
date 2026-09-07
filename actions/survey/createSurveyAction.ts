'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const createSurveySchema = z.object({
  name: z.string().min(2).max(50),
  surveyTargetPlatformEnum: z.string().min(1),
  surveyPurposeEnum: z.string().min(1),
});

export type CreateSurveyInput = z.infer<typeof createSurveySchema>;

export async function createSurveyAction(input: CreateSurveyInput) {
  const parsed = createSurveySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/admin/form/survey', parsed.data);
}
