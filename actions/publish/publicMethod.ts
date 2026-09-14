'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const publicMethodSchema = z.object({
  formId: z.union([z.string(), z.number()]),
  publicationMainPageMethod: z.boolean(),
  capacityPublicLink: z.number().min(0),
  showReportForResponder: z.boolean(),
});

export type PublishPublicMethodInput = z.infer<typeof publicMethodSchema>;

/** Equivalent of POST /api/publish/general */
export async function publishPublicMethodAction(input: PublishPublicMethodInput) {
  const parsed = publicMethodSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
      details: parsed.error.flatten(),
    };
  }

  return api.post('/form-publish-setting/public-method', parsed.data);
}
