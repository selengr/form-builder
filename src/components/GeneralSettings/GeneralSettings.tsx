'use client';
import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoShareSocialSharp } from 'react-icons/io5';
import { useQueryClient } from '@tanstack/react-query';
import { LuCopy, LuRefreshCcw } from 'react-icons/lu';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography } from '@mui/material';
import FormProvider, { RHFCheckBox, RHFTextField } from '../hook-form';

// components
import { SwitchButton } from '../Switch/SwitchButton';
import ConfirmDialog from '@/components/confirm-dialog';

import Share from '../share-media/Share';
import { getAuthToken } from '@/utils/getAuthToken';
import CopyToClipboardButton from '../clipboard-button/CopyToClipBoardButton';

const buttonStylesAlert = {
  height: '50px',
  fontWeight: '400',
  fontSize: '15px',
  borderRadius: '10px',
  boxShadow: 'none',
  transition: 'background-color 0.3s, border-color 0.3s',
  bgcolor: '#1758BA',
  borderColor: '#1758BA',
  '&:hover': {
    bgcolor: '#0F4C8A',
  },
  '&:active': {
    bgcolor: '#0A3A6A',
  },
};

const DEFAULT_LINK = `${process.env.NEXT_PUBLIC_MBZ_DOMAIN}form`;
const propertiesSchema = z.object({
  link: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ' '))
    .pipe(z.string()),
  publicationMainPageMethod: z.boolean(),
  capacityPublicLink: z.number().min(0),
  showReportForResponder: z.boolean(),
});

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

interface GeneralSettingsProps {
  handleOpen: () => void;
  formId: string | number;
  formData: {
    publicLink: string;
    formPublishSetting: {
      capacityPublicLink: number;
      publicationMainPageMethod: boolean
    },
    isCreatedSoloReport: boolean | null
    showReportForResponder: boolean | null
  };
}

const IconButtonContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      padding: { xs: '8px', sm: '8px 15px' },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #1758BA',
      borderRadius: '10px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(23, 88, 186, 0.08)',
      },
    }}>
    {children}
  </Box>
);

export default function GeneralSettings({ handleOpen, formId, formData }: GeneralSettingsProps) {
  const { push } = useRouter()
  const FINAL_LINK = `${DEFAULT_LINK}/${formData.publicLink}`;
  const [isShowReportForResponder, setIsShowReportForResponder] = useState<boolean>(formData?.showReportForResponder || false);
  const [openShowReportForResponderDialog, setOpenShowReportForResponderDialog] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const methods = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'all',
    defaultValues: {
      link: FINAL_LINK,
      publicationMainPageMethod: formData?.formPublishSetting?.publicationMainPageMethod || false,
      capacityPublicLink: 0,
      showReportForResponder: formData?.showReportForResponder || false,
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { isSubmitting, isDirty },
    setError,
  } = methods;

  const onSubmit = useCallback(
    async (values: PropertiesFormSchemaType) => {
      console.log('value', values.showReportForResponder)

      const token = await getAuthToken();
      try {
        const response = await fetch('/api/publish/general', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            formId: Number(formId),
            publicationMainPageMethod: values.publicationMainPageMethod,
            capacityPublicLink: values.capacityPublicLink,
            showReportForResponder: values.showReportForResponder,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.error && data.details) {
            data.details.forEach((err: any) => {
              if (err.path && err.path[0]) {
                setError(err.path[0], {
                  type: 'manual',
                  message: err.message || 'خطا در اعتبارسنجی فیلد',
                });
              }
            });
          } else if (data.error) {
            toast.error(data.error);
          } else {
            toast.error('خطای نامشخص در پاسخ سرور.');
          }
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['datas_builder_query'] });
        handleOpen();
        reset();
        toast.success('با موفقیت به سبد خرید افزوده شد.', {
          className: `max-w-[300px]`,
          duration: 6000,
          action: { 
            label: 'مشاهده سبد خرید',
            onClick: () => {
              push('/purchase-order');
            },
          },
        });

     } catch (error:any) {
        toast.error( error?.message || 'انجام عملیات با خطا مواجه شد');
    }
    },
    [formId, handleOpen, reset, setError],
  );

  const handleCancel = useCallback(() => {
    handleOpen();
    reset();
  }, [handleOpen, reset]);

  const handleShowReportForResponder = () => {
    if (formData.isCreatedSoloReport) {
      const currentValue = getValues("showReportForResponder");
      setValue("showReportForResponder", !currentValue, { shouldDirty: false });
      setIsShowReportForResponder((prev) => !prev)
    } else {
      setOpenShowReportForResponderDialog(true)
    }
  }

  const toggleConfirm = () => {
    setOpenShowReportForResponderDialog((prev) => !prev)
  }

  const handleRedirection = () => {
    push("/reports")
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingX: 1.5,
          direction: 'ltr',
          width: '100%',
          gap: 1,
        }}>
        <Box display='flex' gap={1} mt={4}>
          <IconButtonContainer>
            <LuRefreshCcw size='1.5rem' color='#1758BA' />
          </IconButtonContainer>

          <RHFTextField
            name='link'
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: '10px',
                fontWeight: '600',
              },
            }}
          />

          <CopyToClipboardButton link={FINAL_LINK} icon={<LuCopy size='1.5rem' color='#1758BA' />} />

          <IconButtonContainer>
            <Share
              shareData={{
                title: 'لینک سایا',
                text: 'لینک سایا',
                url: FINAL_LINK,
              }}>
              <IoShareSocialSharp size='1.5rem' color='#1758BA' />
            </Share>
          </IconButtonContainer>
        </Box>

        <Box display='flex' alignItems='center' justifyContent='space-between' gap={3} mt={1}>
          <Box display='flex' flexDirection='column' gap={1} flex={1}>
            <Typography fontWeight={700} fontSize='14px'>
              ظرفیت:
            </Typography>
            {/*<Typography fontWeight={400} fontSize='12px' color='text.secondary'>*/}
            {/*  ظرفیت از پیش موجود 100 نفر*/}
            {/*</Typography>*/}
            <RHFTextField
              type='number'
              name='capacityPublicLink'
              inputProps={{ min: 0, style: { textAlign: 'center' } }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '10px',
                  fontWeight: 600,
                  height: 42,
                },
              }}
            />
          </Box>

          <Box flex={1} mt={3}>
            <Typography fontSize='11px' lineHeight={1.6} textAlign='justify' color='text.secondary'>
              دسترسی به پرسشنامه از طریق پیوند به مقدار ظرفیت تعیین‌شده برای عموم آزاد است و پس از اتمام ظرفیت، دسترسی تا زمان افزودن ظرفیت مجدد محدود خواهد شد.
            </Typography>
          </Box>
        </Box>

        <Box display='flex' flexDirection='column' gap={2} mt={2}>
          <Box display='flex' alignItems='center'>
            <RHFCheckBox name='publicationMainPageMethod' label={undefined} />
            <Typography fontSize='12px' color='text.primary'>
              در صفحه عمومی سایا قابل مشاهده باشد.
            </Typography>
          </Box>

          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='subtitle2' fontWeight={500} fontSize='14px'>
              نمایش نتیجه به پاسخ دهنده
            </Typography>
            <SwitchButton
              onChange={handleShowReportForResponder}
              checked={isShowReportForResponder}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '10px',
                  fontWeight: 600,
                  height: 42,
                },
              }}
            />
          </Box>

        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          px: 2,
          width: '100%',
          mt: 3,
          marginBottom: '16px',
        }}>
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={isSubmitting}
          loading={isSubmitting}
          sx={{
            bgcolor: 'primary.main',
            height: 54,
            color: 'white',
            fontSize: { xs: '13px', sm: '16px' },
            fontWeight: 700,
            borderRadius: '10px',
            boxShadow: 'none',
            '&:hover, &:active': {
              bgcolor: 'primary.dark',
              boxShadow: 'none',
            },
          }}>
          {methods.watch('capacityPublicLink') > 0
            ? 'افزودن به سبد خرید'
            : 'اعمال تغییرات'}
        </Button>

        <Button
          disabled={isSubmitting}
          type='button'
          fullWidth
          variant='outlined'
          onClick={handleCancel}
          sx={{
            height: 54,
            fontWeight: 700,
            borderRadius: '10px',
            fontSize: { xs: '13px', sm: '16px' },
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            },
          }}>
          بستن
        </Button>
      </Box>

      <ConfirmDialog
        content='تا زمانی که قالب گزارش انفرادی نساخته باشید نمیتواند این تیک را بزند '
        open={openShowReportForResponderDialog}
        title='اخطار'
        onClose={toggleConfirm}
        cancelText='انصراف'
        action={
          <Button type='submit' fullWidth disableRipple variant='contained'
            sx={{ ...buttonStylesAlert }}
            onClick={handleRedirection}
          >
            برو به قالب گزارش
          </Button>
        }
      />
    </FormProvider>
  );
}
