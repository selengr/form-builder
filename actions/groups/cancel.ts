'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const cancelGroupAllocationSchema = z.object({
  formId: z.number(),
  unselectedGroupsId: z.array(z.number()).nonempty(),
});

export type CancelGroupAllocationInput = z.infer<typeof cancelGroupAllocationSchema>;

export async function cancelGroupAllocationAction(input: CancelGroupAllocationInput) {
  const parsed = cancelGroupAllocationSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/form-publish-setting/cancel-group-allocation', parsed.data);
}
