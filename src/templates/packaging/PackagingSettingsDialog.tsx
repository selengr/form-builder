'use client';
import { z } from 'zod';
import { toast } from 'sonner';
import { CgClose } from 'react-icons/cg';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import FormProvider, { RHFMultiSelectV0, RHFTextField } from '@/components/hook-form';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { getPackageSettingAction, putPackageSettingAction } from '../../../actions/packaging/packageSetting';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetUserPackagingRequestParentCategory,
  UserPackagingRequestCategorySelectOption,
} from '@/templates/user-packaging-request/hooks/useGetUserPackagingRequestParentCategory';
import { useGetUserPackagingRequestSubCategory } from '@/templates/user-packaging-request/hooks/useGetUserPackagingRequestSubCategory';

const nameSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\s+/g, ' '))
  .pipe(z.string().min(2, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }).max(50, { message: 'حداقل باید 2 و حداکثر 50 کاراکتر باشد' }));

const propertiesSchema = z.object({
  name: nameSchema,
  ratio: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: 'عدد معتبر وارد کنید' })
      .min(1, { message: 'ضریب باید حداقل ۱ باشد' }),
  ),
  categoryIds: z.preprocess(
    (value) => (Array.isArray(value) ? value.filter(Boolean) : []),
    z.array(z.string()),
  ),
  subCategoryIds: z.preprocess(
    (value) => (Array.isArray(value) ? value.filter(Boolean) : []),
    z.array(z.string()),
  ),
});

type PackageSettingSchemaType = z.infer<typeof propertiesSchema>;

const textFieldCommonSx = {
  '& .MuiInputBase-root': {
    bgcolor: '#fff',
    borderRadius: '10px',
    paddingY: '0',
  },
};

const inputFieldContainerSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  paddingX: 0.5,
};

function splitSavedCategoryIds(
  allIds: string[],
  categories?: UserPackagingRequestCategorySelectOption[],
) {
  if (!allIds.length || !categories?.length) {
    return { categoryIds: [] as string[], subCategoryIds: allIds };
  }

  const categoryIds = allIds.filter((id) =>
    categories.some((category) => category.value === id),
  );
  const subCategoryIds = allIds.filter((id) => !categoryIds.includes(id));

  return { categoryIds, subCategoryIds };
}

export default function PackagingSettingsDialog({ packageId }: { packageId: number }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { categories, isFetchingCategory } = useGetUserPackagingRequestParentCategory();
  const { mutation, subCategories } = useGetUserPackagingRequestSubCategory();

  const handleOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  const methods = useForm<PackageSettingSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      ratio: 1,
      categoryIds: [],
      subCategoryIds: [],
    },
  });

  const {
    watch,
    getValues,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, dirtyFields },
  } = methods;

  const watchCategoryIds = watch('categoryIds');

  useEffect(() => {
    if (watchCategoryIds.length === 0) {
      setValue('subCategoryIds', [], { shouldDirty: false });
    }
  }, [watchCategoryIds, setValue]);

  useEffect(() => {
    if (!openDialog || isFetchingCategory) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const res = await getPackageSettingAction(packageId);

        if (!res.success) {
          toast.error(res.message || 'خطا در دریافت تنظیمات پکیج');
          return;
        }

        if (cancelled) return;

        const data = res.data;
        const allIds = data.formCategorysModel?.categoryId?.map(String) ?? [];
        const { categoryIds, subCategoryIds } = splitSavedCategoryIds(allIds, categories);

        reset(
          {
            name: data.name || '',
            ratio: data.ratio || 1,
            categoryIds,
            subCategoryIds,
          },
          { keepDirty: false },
        );

        if (categoryIds.length > 0) {
          mutation.mutate(categoryIds);
        }
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'خطا در دریافت تنظیمات پکیج');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [openDialog, packageId, categories, isFetchingCategory, reset, mutation.mutate]);

  const handleFetchSubcategories = () => {
    const selectedCategoryIds = getValues('categoryIds');
    if (selectedCategoryIds.length > 0) {
      mutation.mutate(selectedCategoryIds);
    }
  };

  const onSubmit = async (formData: PackageSettingSchemaType) => {
    try {
      const categoriesChanged =
        Boolean(dirtyFields.categoryIds) || Boolean(dirtyFields.subCategoryIds);

      let formCategorysModel: { categoryId: number[] } | null = null;

      if (categoriesChanged) {
        const categoryIds = (formData.categoryIds ?? []).filter(Boolean);
        const subCategoryIds = (formData.subCategoryIds ?? []).filter(Boolean);
        const allCategoryIds = [...categoryIds, ...subCategoryIds]
          .map(Number)
          .filter((id) => Number.isFinite(id) && id > 0);

        formCategorysModel =
          allCategoryIds.length > 0 ? { categoryId: allCategoryIds } : null;
      }

      const res = await putPackageSettingAction(packageId, {
        name: formData.name,
        ratio: formData.ratio,
        formCategorysModel,
      });

      if (!res.success) {
        toast.error(res.message || 'خطا در ثبت تنظیمات پکیج');
        return;
      }

      toast.success('عملیات با موفقیت انجام شد');
      queryClient.invalidateQueries({
        queryKey: ['datas_builder_query'],
      });
      queryClient.invalidateQueries({
        queryKey: ['packaging_new_list'],
      });
      handleOpen();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'خطا در ثبت تنظیمات پکیج');
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          padding: 0,
          height: '40px',
          width: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        aria-label="تنظیمات بسته">
        <IoSettingsOutline color="#2A2A2A" />
      </IconButton>
      <Dialog
        open={openDialog}
        onClose={handleOpen}
        dir="ltr"
        sx={{
          overflow: 'hidden',
          scrollbarWidth: 'none',
          '& .MuiPaper-root': {
            borderRadius: '24px',
            margin: '10px',
            width: '100%',
            maxWidth: '600px',
          },
          '& .MuiDialog-container': {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'hsl(0deg 0% 100% / 50%)',
          },
        }}>
        <Box className="flex items-center justify-start" sx={{ p: 2, pb: 0 }}>
          <IconButton onClick={handleOpen} aria-label="بستن">
            <CgClose color="#404040" size="1.5rem" />
          </IconButton>
        </Box>
        <DialogContent
          dir="rtl"
          sx={{
            maxHeight: '75vh',
            scrollbarWidth: 'thin',
            paddingX: 1,
            paddingTop: 0,
            paddingBottom: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
          <Box className="flex justify-center items-baseline" sx={{ mb: 2 }}>
            <Typography variant="h6" component="p" fontWeight="bold" textAlign="center">
              تنظیمات بسته
            </Typography>
          </Box>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                bgcolor: '#F7F7FF',
                borderRadius: '8px',
                padding: 2,
                paddingBottom: 4,
                marginY: 2,
                gap: 1,
                direction: 'ltr',
              }}>
              <Box display="flex" gap={1} width="100%">
                <Box sx={inputFieldContainerSx}>
                  <Typography variant="subtitle2" fontWeight="700">
                    نام بسته:
                  </Typography>
                  <RHFTextField disabled={loading} sx={textFieldCommonSx} name="name" fullWidth />
                </Box>

                <Box sx={inputFieldContainerSx}>
                  <Typography variant="subtitle2" fontWeight="700">
                    ضریب قیمت:
                  </Typography>
                  <RHFTextField
                    sx={textFieldCommonSx}
                    disabled={loading}
                    name="ratio"
                    fullWidth
                    type="number"
                    inputProps={{ step: '0.1', min: '1' }}
                  />
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="6px" width="100%" mt={1}>
                <Typography variant="subtitle2" fontWeight={700}>
                  دسته بند‌ی‌ها (اختیاری):
                </Typography>
                <RHFMultiSelectV0
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#fff',
                      paddingY: '8px',
                      borderRadius: '10px',
                    },
                  }}
                  chip
                  checkbox
                  fullWidth
                  name="categoryIds"
                  options={categories ?? []}
                  isLoading={isFetchingCategory || loading}
                  disabled={isFetchingCategory || loading}
                  onClose={handleFetchSubcategories}
                />

                <RHFMultiSelectV0
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#fff',
                      paddingY: '8px',
                      borderRadius: '10px',
                    },
                  }}
                  chip
                  checkbox
                  fullWidth
                  name="subCategoryIds"
                  options={subCategories ?? []}
                  isLoading={mutation.isPending}
                  disabled={watchCategoryIds.length === 0 || mutation.isPending || loading}
                />
              </Box>

              {loading && (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  در حال بارگذاری اطلاعات...
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                background: '#FFF',
                py: '10px',
                px: 2,
                my: 3,
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting || loading}
                  sx={{
                    bgcolor: '#1758BA',
                    height: '54px',
                    color: 'white',
                    fontSize: { xs: '13px', sm: '16px' },
                    fontWeight: '700',
                    borderRadius: '10px',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#1758BA' },
                  }}>
                  {loading ? 'در حال ثبت...' : 'ثبت'}
                </Button>
                <Button
                  disabled={isSubmitting || loading}
                  fullWidth
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    handleOpen();
                    reset();
                  }}
                  sx={{
                    height: '54px',
                    fontWeight: '700',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#1758BA',
                    borderColor: '#1758BA',
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'transparent' },
                  }}>
                  بستن
                </Button>
              </Box>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
