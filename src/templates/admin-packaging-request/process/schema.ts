import { z } from 'zod';

export const processPackagingRequestSchema = z.object({
  newComment: z.string().optional(),
});

export type ProcessPackagingRequestFormValues = z.infer<typeof processPackagingRequestSchema>;
