'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const addByExcelSchema = z.object({
  uuid: z.string(),
  groupName: z.string(),
  groupId: z.string().nullable().optional(),
});

export type AddByExcelInput = z.infer<typeof addByExcelSchema>;

export async function addMembersByExcelAction(input: AddByExcelInput) {
  const parsed = addByExcelSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/user-group/member/add-by-excel', parsed.data);
}
