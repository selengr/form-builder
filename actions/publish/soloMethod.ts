'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const withGroupIdSchema = z.object({
  formId: z.string(),
  introducedUserJTGroupId: z.number(),
  showReportForResponder: z.boolean(),
});

const withoutGroupIdSchema = z.object({
  formId: z.string(),
  introducedUserJTGroupId: z.null(),
  name: z.string(),
  lname: z.string(),
  username: z.string(),
  gender: z.enum(['MALE', 'FEMALE']),
  showReportForResponder: z.boolean(),
});

const soloMethodSchema = z.union([withGroupIdSchema, withoutGroupIdSchema]);

export type PublishSoloMethodInput = z.infer<typeof soloMethodSchema>;

/** Equivalent of POST /api/publish/individual */
export async function publishSoloMethodAction(input: PublishSoloMethodInput) {
  const parsed = soloMethodSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
      details: parsed.error.flatten(),
    };
  }

  return api.post('/form-publish-setting/solo-method', parsed.data);
}
