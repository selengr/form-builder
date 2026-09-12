'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const publishSchema = z.object({
  formId: z.union([z.string(), z.array(z.string())]),
  IsSurvey: z.boolean(),
  IsPackaging: z.boolean(),
});

export type PublishFormInput = z.infer<typeof publishSchema>;

export async function publishFormAction(input: PublishFormInput) {
  const parsed = publishSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  const { formId, IsSurvey, IsPackaging } = parsed.data;
  const id = Array.isArray(formId) ? formId[0] : formId;

  if (IsSurvey) {
    return api.put(`/admin/form/survey/finalization/${id}`);
  }

  if (IsPackaging) {
    return api.put(`/admin/packaging/finalization/${id}`);
  }

  return api.put(`/form/ready-to-publish/${id}`);
}
