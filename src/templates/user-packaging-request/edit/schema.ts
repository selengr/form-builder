import { z } from 'zod';

const optionalDocumentIdSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().optional());

export const packagingRequestDocumentSchema = z.object({
  id: optionalDocumentIdSchema,
  title: z.string().trim().min(1, { message: 'نام مدرک الزامی است' }),
  uuid: z.string().trim().min(1, { message: 'بارگذاری فایل الزامی است' }),
  link: z.string().optional(),
});

export const editPackagingRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' })
        .max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }),
    ),
  categoryIds: z.array(z.string()),
  subCategoryIds: z.array(z.string()),
  documentList: z
    .array(packagingRequestDocumentSchema)
    .min(1, { message: 'حداقل یک مدرک باید بارگذاری شود' })
    .max(10, { message: 'حداکثر 10 مدرک مجاز است' }),
  newComment: z.string().optional(),
});

export type EditPackagingRequestFormValues = z.infer<typeof editPackagingRequestSchema>;
