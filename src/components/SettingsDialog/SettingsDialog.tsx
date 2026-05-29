'use client';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { CgClose } from 'react-icons/cg';
import { useForm } from 'react-hook-form';
import { IoSettingsOutline } from 'react-icons/io5';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';

// lib
import { convertObject } from '@/lib/settingsUtils';

// icon
import EditIcon from '@/../public/images/home-page/edit-green.svg';

// hook
import FieldSwitchPair from './FieldSwitchPair';
import FormProvider, { RHFTextField } from '../hook-form';

// actions
import { formSetting } from '../../../actions/builder/form-setting';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  data: any;
  formName: string;
  formLimitation?: string | null;
  isBuilderCardId?: string;
  onChangeName?: (newName: string) => void;
  onChangeLimitation?: (value: string | null) => void;
}

const responseLimitationOptions = [
  { label: 'از طریق شماره همراه', value: 'PHONE_NUMBER' },
];

const fieldsConfig = [
  {
    name: 'responseLimitation',
    label: 'محدودیت پاسخ‌‌دهی',
    type: 'select',
    options: responseLimitationOptions,
    disabled: false,
  },
];

const propertiesSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((v) => v.replace(/\s+/g, ' '))
    .pipe(
      z
        .string()
        .min(2, { message: 'حداقل باید 2 و حداکثر 70 کاراکتر باشد' })
        .max(70, { message: 'حداقل باید 2 و حداکثر 70 کاراکتر باشد' })
    ),

  label: z
    .string()
    .trim()
    .transform((value) => {
      const normalized = value.replace(/\s+/g, ' ');
      return normalized === '' ? null : normalized;
    })
    .nullable()
    .refine(
      (value) =>
        value === null ||
        !/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(value),
      { message: 'استفاده از حروف فارسی مجاز نیست' }
    )
    .refine(
      (value) => value === null || (value.length >= 8 && value.length <= 30),
      { message: 'حداقل باید 8 و حداکثر 30 کاراکتر باشد' }
    ),

  responseLimitation: z
    .object({
      value: z.string(),
      checked: z.boolean(),
    })
    .refine(
      (data) => {
        if (data.checked && !data.value) return false;
        return true;
      },
      {
        message: 'لطفاً نوع محدودیت پاسخ‌دهی را انتخاب کنید',
        path: ['value'],
      }
    ),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function SettingsDialog({
  formName,
  onChangeName,
  data,
  isBuilderCardId,
  formLimitation,
  onChangeLimitation,
}: Props) {
  const { id: formId } = useParams();
  const searchParams = useSearchParams();
      const queryClient = useQueryClient()

  const [openDialog, setOpenDialog] = useState(false);

  const search = searchParams.get('admin');
  const IsDataCollection = search === 'data-collection';

  const handleOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'all',
    defaultValues: {
      name: formName,
      label: data?.formSettingModel?.label ?? '',
      responseLimitation: {
        checked: !!formLimitation,
        value: formLimitation ?? '',
      },
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const body: any = {
      ...convertObject(values as any, fieldsConfig),
      name: values.name,
    };

    if (values.label && IsDataCollection) {
      body['label'] = values.label;
    }

    try {
      await formSetting(isBuilderCardId ?? (formId as string), body);

      toast.success('تنظیمات با موفقیت ثبت شد');
        queryClient.invalidateQueries({ queryKey: ["datas_builder_query"] })
      onChangeName?.(values.name);

      onChangeLimitation?.(
        values.responseLimitation.checked
          ? values.responseLimitation.value
          : null
      );

      handleOpen();
    } catch (error: any) {
      toast.error(error?.message || 'انجام عملیات با خطا مواجه شد');
    }
  }

  useEffect(() => {
    reset({
      name: formName,
      label: data?.formSettingModel?.label ?? '',
      responseLimitation: {
        checked: !!formLimitation,
        value: formLimitation ?? '',
      },
    });
  }, [formName, formLimitation, data, reset]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          height: '40px',
          width: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!isBuilderCardId && <IoSettingsOutline color="#2A2A2A" />}
        {isBuilderCardId && (
          <Image src={EditIcon} alt="edit" width={24} height={24} />
        )}
      </IconButton>

      <Dialog
        open={openDialog}
        dir="ltr"
        sx={{
          overflow: 'hidden',
          scrollbarWidth: 'none',
          '& .MuiPaper-root': {
            borderRadius: '24px',
            margin: '10px',
          },
          '& .MuiDialog-container': {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'hsl(0deg 0% 100% / 50%)',
          },
        }}
      >
        {openDialog && (
          <>
            <div className="flex items-center justify-start">
              <button className="mx-4 mt-4 mb-0" onClick={handleOpen}>
                <CgClose size="1.5rem" color="#404040" />
              </button>
            </div>

            <DialogContent
              dir="rtl"
              sx={{
                maxHeight: '75vh',
                scrollbarWidth: 'thin',
                maxWidth: '100%',
                width: '450px',
                paddingX: 1,
                paddingTop: 0,
              }}
            >
              <div className="flex flex-col pb-4 p-2">
                <div className="flex justify-center items-baseline mb-6">
                  <p className="font-bold text-center text-[20px]">
                    تنظیمات پرسشنامه
                  </p>
                </div>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingX: 1.5,
                      direction: 'ltr',
                      width: '100%',
                      gap: '20px',
                    }}
                  >
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography fontWeight="600" fontSize="15px">
                        نام پرسشنامه:
                      </Typography>
                      <RHFTextField
                        name="name"
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: '10px',
                            fontWeight: '600',
                          },
                        }}
                      />
                    </Box>

                    {IsDataCollection && (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography fontWeight="600" fontSize="15px">
                          شناسه:
                        </Typography>
                        <RHFTextField
                          name="label"
                          sx={{
                            '& .MuiInputBase-root': {
                              borderRadius: '10px',
                              fontWeight: '600',
                            },
                          }}
                        />
                      </Box>
                    )}

                    {fieldsConfig.map((field) => (
                      <FieldSwitchPair
                        key={field.name}
                        fieldName={field.name}
                        label={field.label}
                        type={field.type}
                        options={field.options}
                        disabled={field.disabled}
                      />
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '16px',
                      paddingX: '16px',
                      width: '100%',
                      marginTop: '38px',
                    }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        bgcolor: '#1758BA',
                        height: '50px',
                        fontSize: '16px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#1758BA' },
                      }}
                    >
                      ثبت
                    </Button>

                    <Button
                      type="button"
                      fullWidth
                      variant="outlined"
                      disabled={isSubmitting}
                      onClick={handleOpen}
                      sx={{
                        height: '50px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        fontSize: '16px',
                        color: '#1758BA',
                        borderColor: '#1758BA',
                      }}
                    >
                      انصراف
                    </Button>
                  </Box>
                </FormProvider>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
