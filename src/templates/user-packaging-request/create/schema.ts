import { z } from 'zod';

const documentItemSchema = z.object({
  title: z.string().trim().min(1, { message: 'نام مدرک الزامی است' }),
  uuid: z.string().trim().min(1, { message: 'بارگذاری فایل الزامی است' }),
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
  categoryIds: z.array(z.string()).min(1, { message: 'لطفا حداقل یک دسته بندی را انتخاب کنید' }),
  subCategoryIds: z
    .array(z.string())
    .min(1, { message: 'لطفا حداقل یک زیردسته را انتخاب کنید' }),
  documentList: z
    .array(documentItemSchema)
    .min(1, { message: 'حداقل یک مدرک باید بارگذاری شود' })
    .max(10, { message: 'حداکثر 10 مدرک مجاز است' }),
  newComment: z.string().optional(),
});

export type CreatePackagingRequestFormValues = z.infer<typeof createPackagingRequestSchema>;
