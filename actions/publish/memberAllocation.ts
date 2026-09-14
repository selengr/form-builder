'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const newMemberAllocationSchema = z.object({
  formId: z.number(),
  introducedUserJTGroupIdList: z.array(z.number()).nonempty(),
});

const cancelMemberAllocationSchema = z.object({
  formId: z.number(),
  introducedUserPublishIdList: z.array(z.number()).nonempty(),
});

export type NewMemberAllocationInput = z.infer<typeof newMemberAllocationSchema>;
export type CancelMemberAllocationInput = z.infer<typeof cancelMemberAllocationSchema>;

export async function newMemberAllocationAction(input: NewMemberAllocationInput) {
  const parsed = newMemberAllocationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/form-publish-setting/new-member-allocation', parsed.data);
}

export async function cancelMemberAllocationAction(input: CancelMemberAllocationInput) {
  const parsed = cancelMemberAllocationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/form-publish-setting/cancel-member-allocation', parsed.data);
}
