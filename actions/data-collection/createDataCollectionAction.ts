'use server';

import { z } from 'zod';
import { api } from '@/services/axios/actionWapper';

const createDataCollectionSchema = z.object({
  name: z.string().min(2).max(50),
  targetPlatformEnum: z.string().min(1),
  label: z.string().min(8).max(30),
});

export type CreateDataCollectionInput = z.infer<typeof createDataCollectionSchema>;

export async function createDataCollectionAction(input: {
  name: string;
  targetPlatformEnum: string;
  label: string | null;
}) {
  const parsed = createDataCollectionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      message: 'Validation error.',
    };
  }

  return api.post('/admin/form/data-collection', parsed.data);
}
