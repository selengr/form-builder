import { z } from 'zod';

const documentItemSchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(1, { message: 'نام مدرک الزامی است' }),
  uuid: z.string().trim().min(1, { message: 'بارگذاری فایل الزامی است' }),
  link: z.string().optional(),
});

export const createPackagingRequestSchema = z.object({
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
  targetLabelEnum: z.string().min(1, { message: 'لطفا یک مورد را انتخاب کنید' }),
  ownershipTypeEnum: z
    .string()
    .min(1, { message: 'لطفاً یک گزینه را انتخاب کنید' })
    .refine((value) => value === 'OWNERSHIP_SINGLE' || value === 'OWNERSHIP_MULTI', {
      message: 'لطفاً یک گزینه را انتخاب کنید',
    }),
  categoryIds: z.preprocess(
    (value) => (Array.isArray(value) ? value.filter(Boolean) : []),
    z.array(z.string()),
  ),
  subCategoryIds: z.preprocess(
    (value) => (Array.isArray(value) ? value.filter(Boolean) : []),
    z.array(z.string()),
  ),
  documentList: z
    .array(documentItemSchema)
    .min(1, { message: 'حداقل یک مدرک باید بارگذاری شود' })
    .max(10, { message: 'حداکثر 10 مدرک مجاز است' }),
  newComment: z.string().optional(),
});

export type CreatePackagingRequestFormValues = z.infer<typeof createPackagingRequestSchema>;
