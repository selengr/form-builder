'use client';
import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { CgClose } from 'react-icons/cg';
import { z } from 'zod';
import FormProvider, { RHFTextField } from '../hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FieldSwitchPair from './FieldSwitchPair';
import { IoSettingsOutline } from 'react-icons/io5';
import { AxiosApi } from '@/services/axios/AxiosApi';
import { useParams, useSearchParams } from 'next/navigation';
import { convertObject } from '@/lib/settingsUtils';

interface Props {
  formName: string;
  data:any;
  onChangeName: (newName: string) => void;

}

const responseLimitationOptions = [
  { label: 'از طریق شماره همراه', value: 'PHONE_NUMBER' },
  {
    label: 'از طریق ایمیل',
    value: 'EMAIL',
  },
];

const layoutOptions = [
  { label: 'نمایش فهرستی', value: 'list-view' },
  { label: 'نمایش صفحه‌ای', value: 'page-view' },
];

const themeOptions = [{ label: 'تم 1', value: 'theme_1' }];

const fieldsConfig = [
  {
    name: 'timeToComplete',
    label: 'زمان شروع',
    type: 'time-picker',
    disabled: false,
  },
  {
    name: 'expireDate',
    label: 'تاریخ فعال سازی و انقضا فرم',
    type: 'date-picker',
    disabled: false,
  },
  {
    name: 'responseLimitation',
    label: 'محدودیت پاسخ‌‌دهی',
    type: 'select',
    options: responseLimitationOptions,
    disabled: false,
  },
  // {
  //   name: 'layout',
  //   label: 'حالت نمایش',
  //   type: 'multi-select',
  //   options: layoutOptions,
  //   disabled: true,
  // },
  // {
  //   name: 'theme',
  //   label: 'پوسته',
  //   type: 'select',
  //   options: themeOptions,
  //   disabled: true,
  // },
];

const propertiesSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string().min(2, { message: 'حداقل باید 2 و حداکثر 100 کاراکتر باشد' }).max(100, { message: 'حداقل باید 2 و حداکثر 100 کاراکتر باشد' })),
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
        {
          message: 'استفاده از حروف فارسی مجاز نیست',
        }
      )
    .refine(
        (value) => value === null || (value.length >= 8 && value.length <= 30),
        {
          message: 'حداقل باید 8 و حداکثر 30 کاراکتر باشد',
        }
      ),
  responseLimitation: z.object({
    value: z.string(),
    checked: z.boolean(),
  }),
  // layout: z.object({
  //   value: z.array(z.string()),
  //   checked: z.boolean(),
  // }),
  // theme: z.object({
  //   value: z.string(),
  //   checked: z.boolean(),
  // }),
  expireDate: z.object({
    value: z.any(),
    checked: z.boolean(),
  }),
  timeToComplete: z.object({
    value: z.any(),
    checked: z.boolean(),
  }),
});

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

export default function SettingsDialog({ formName, onChangeName,data }: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [formFieldName, setFormFieldName] = useState<string>(formName);
  // const [formFieldId, setFormFieldId] = useState<string>(data.formSettingModel.label??"");
  const { id: formId } = useParams();
  const searchParams = useSearchParams();
  const search = searchParams.get('admin');
  const IsDataCollection = search ==='data-collection';

  const handleOpen = useCallback(() => {
    setOpenDialog((prev) => !prev);
    reset();
  }, []);

  const methods = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'all',
    defaultValues: {
      name: formFieldName,
      label: data.formSettingModel.label,
      expireDate: { checked: false, value: '' },
      timeToComplete: { checked: false, value: '' },
      responseLimitation: { checked: false, value: '' },
      // layout: { checked: false, value: [] },
      // theme: { checked: false, value: '' },
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function onSubmit(values: propertiesFormSchemaType) {
    const lab = values.label
    const body : any = {
      ...convertObject(values as any, fieldsConfig),
      name: formFieldName,
    };
    
    if(lab && IsDataCollection){
      body["label"] = lab
    }

    try {
      const res = await AxiosApi.post(`/form-setting/${formId}`, body as any);
      handleOpen();
      onChangeName(formFieldName);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (data?.formSettingModel) {
      // فقط فیلدهای سوئیچ‌پیر
      const serverValues = {
        expireDate: {
          checked: !!data.formSettingModel.expireDate,
          value: data.formSettingModel.expireDate || '',
        },
        timeToComplete: {
          checked: !!data.formSettingModel.timeToComplete,
          value: data.formSettingModel.timeToComplete || '',
        },
        responseLimitation: {
          checked: !!data.formSettingModel.responseLimitation,
          value: data.formSettingModel.responseLimitation || '',
        },
      };

      reset((prev) => ({ ...prev, ...serverValues }));
    }
  }, [data, reset]);

  useEffect(() => {
    reset();
  }, [openDialog]);

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
        }}>
        <IoSettingsOutline color='#2A2A2A' />
      </IconButton>
      <Dialog
        open={openDialog}
        dir='ltr'
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
        }}>
        {openDialog && (
          <>
            <div className='flex items-center justify-start'>
              <button className='mx-4 mt-4 mb-0' onClick={handleOpen}>
                <CgClose color='#404040' width={25} height={25} size='1.5rem' />
              </button>
            </div>
            <DialogContent
              dir='rtl'
              sx={{
                maxHeight: '75vh',
                scrollbarWidth: 'thin',
                maxWidth: '100%',
                width: '450px',
                paddingX: 1,
                paddingTop: 0,
              }}>
              <div dir='rtl' className='flex flex-col pb-4 p-2'>
                <div className='flex justify-center items-baseline mb-6'>
                  <p className='font-bold text-center text-[20px]'>تنظیمات پرسشنامه</p>
                </div>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      paddingX: 1.5,
                      direction: 'ltr',
                      width: '100%',
                      gap: '20px',
                    }}>
                    <Box display='flex' flexDirection='column' gap={1}>
                      <Typography variant='subtitle2' fontWeight='600' fontSize='15px'>
                        نام پرسشنامه:
                      </Typography>
                      <RHFTextField
                        name='name'
                        value={formFieldName}
                        onChange={(event) => setFormFieldName(event.target.value)}
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: '10px',
                            fontWeight: '600',
                          },
                        }}
                      />
                    </Box>
                   {IsDataCollection && <Box display='flex' flexDirection='column' gap={1}>
                      <Typography variant='subtitle2' fontWeight='600' fontSize='15px'>
                        شناسه:
                      </Typography>
                      <RHFTextField
                        name='label'
                        // value={formFieldId}
                        // onChange={(event) => setFormFieldId(event.target.value)}
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: '10px',
                            fontWeight: '600',
                          },
                        }}
                      />
                    </Box>
                    }
                    {fieldsConfig.map((field) => (
                      <FieldSwitchPair key={field.name} fieldName={field.name} label={field.label} type={field.type} options={field.options} disabled={field?.disabled} />
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      paddingX: '16px',
                      width: '100%',
                      marginTop: '38px',
                    }}>
                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      disableRipple
                      sx={{
                        bgcolor: '#1758BA',
                        height: '50px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        boxShadow: 'none',
                        '&.MuiButtonBase-root:hover, &.MuiButtonBase-root:active': {
                          bgcolor: '#1758BA',
                          boxShadow: 'none',
                        },
                      }}>
                      ثبت
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type='button'
                      fullWidth
                      className='text-[16px] text-[#1758BA]'
                      sx={{
                        height: '50px',
                        fontWeight: '700',
                        borderRadius: '10px',
                        fontSize: '16px',
                        color: '#1758BA',
                        borderColor: '#1758BA',
                        bgcolor: 'white',
                        '&.MuiButtonBase-root:hover': {
                          bgcolor: 'transparent',
                          boxShadow: 'none',
                          color: '#1758BA',
                        },
                      }}
                      variant='outlined'
                      onClick={handleOpen}>
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
