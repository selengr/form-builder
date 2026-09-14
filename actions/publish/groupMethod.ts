'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const groupMethodSchema = z.object({
  formId: z.number(),
  groupsId: z.array(z.number()).nonempty(),
  showReportForResponder: z.boolean(),
});

export type PublishGroupMethodInput = z.infer<typeof groupMethodSchema>;

/** Equivalent of POST /api/publish/group */
export async function publishGroupMethodAction(input: PublishGroupMethodInput) {
  const parsed = groupMethodSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
      details: parsed.error.flatten(),
    };
  }

  return api.post('/form-publish-setting/group-method', parsed.data);
}
