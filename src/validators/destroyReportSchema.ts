import { z } from 'zod';

export const destroyReportSchema = z.object({
  formId: z.number(),
  description: z.string().min(1),
  username: z.string().min(5),
  responseForDestroyerReport: z.enum(['PRIVACY_VIOLATION', 'INTELLECTUAL_PROPERTY_INFRINGMENT', 'INAPPROPRIATE_CONTENT', 'OTHER']),
  typeOfReport: z.enum(['REPORT', 'FORM']),
  questionId: z.number().optional(),
  resultReportText: z.string().optional(),
});
